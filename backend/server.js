import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import pool from "./db.js"; // your PostgreSQL pool connection
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import ordersRoutes from "./routes/orders.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);

const PORT = process.env.PORT || 5000;

// Initialize database: create tables and seed products
const initDB = async () => {
  try {
    // 1️⃣ Create tables if not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200),
        email VARCHAR(200) UNIQUE,
        password TEXT
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        price NUMERIC(10,2),
        image_url TEXT,
        stock INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        product_id INT REFERENCES products(id) ON DELETE CASCADE,
        quantity INT DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT REFERENCES products(id),
        quantity INT
      );
    `);

    // 2️⃣ Seed sample products if table is empty
    const { rows } = await pool.query("SELECT COUNT(*) FROM products");
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO products (title, description, price, image_url, stock) VALUES
        ('Tesla Model S', 'Luxury electric sedan with autopilot and long range.', 79999, 'https://tesla-cdn.thron.com/delivery/public/image/tesla/1ed1f31b-b17e-4b11-85e1-512e5bc9d472/bvlatuR/std/1920x1080/Desktop-ModelS', 10),
        ('BMW i8', 'Hybrid sports car with futuristic design.', 140000, 'https://cdn.bmwblog.com/wp-content/uploads/2019/03/BMW-i8-Roadster.jpg', 5),
        ('Audi R8', 'High-performance sports car with V10 engine.', 170000, 'https://www.audi-mediacenter.com/en/audi-r8-10', 8),
        ('Ford Mustang GT', 'Classic muscle car with powerful V8 engine.', 55000, 'https://cdn.motor1.com/images/mgl/g47zJ/s1/ford-mustang-shelby-gt500.jpg', 12),
        ('Mercedes-Benz G-Class', 'Luxury SUV with off-road capabilities.', 130000, 'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my23/g/suv/class-page/2023-G-CLASS-SUV-HIGHLIGHTS-DR.jpg', 6),
        ('Porsche 911', 'Iconic sports car with rear-engine design.', 120000, 'https://files.porsche.com/filestore/image/multimedia/none/992-carrera-modelimage-sideshot/model/b8e7f79a-52f3-11eb-80d5-005056bbdc38;sM;twebp/porsche-model.png', 9);
      `);
      console.log("✅ Sample products seeded!");
    }

    console.log("✅ Database initialized!");
  } catch (err) {
    console.error("❌ Database init error:", err);
  }
};

// Start server after DB initialization
initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
});
