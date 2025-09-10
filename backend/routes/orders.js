import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// create order from cart
router.post("/", authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userId = req.user.id;
    const { address } = req.body;

    // get cart items
    const cartRes = await client.query("SELECT product_id, quantity FROM cart WHERE user_id=$1", [userId]);
    if (!cartRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cart empty" });
    }

    const orderRes = await client.query(
      "INSERT INTO orders(user_id, address) VALUES($1,$2) RETURNING id, created_at",
      [userId, address || ""]
    );
    const orderId = orderRes.rows[0].id;

    for (const item of cartRes.rows) {
      await client.query(
        "INSERT INTO order_items(order_id, product_id, quantity) VALUES($1,$2,$3)",
        [orderId, item.product_id, item.quantity]
      );
      // reduce stock
      await client.query("UPDATE products SET stock = stock - $1 WHERE id=$2", [item.quantity, item.product_id]);
    }

    await client.query("DELETE FROM cart WHERE user_id=$1", [userId]);
    await client.query("COMMIT");
    res.json({ success: true, orderId, created_at: orderRes.rows[0].created_at });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

// get orders for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await pool.query("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC", [userId]);
    res.json(orders.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
