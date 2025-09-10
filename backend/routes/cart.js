import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// get cart for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT c.id as cart_id, c.quantity, p.* FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id=$1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// add/update item
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;
    // upsert
    const exists = await pool.query("SELECT id FROM cart WHERE user_id=$1 AND product_id=$2", [userId, product_id]);
    if (exists.rows.length) {
      await pool.query("UPDATE cart SET quantity=$1 WHERE id=$2", [quantity, exists.rows[0].id]);
    } else {
      await pool.query("INSERT INTO cart(user_id, product_id, quantity) VALUES($1,$2,$3)", [userId, product_id, quantity]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// remove
router.delete("/:product_id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query("DELETE FROM cart WHERE user_id=$1 AND product_id=$2", [userId, req.params.product_id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
