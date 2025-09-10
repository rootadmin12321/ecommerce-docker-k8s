import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "ecommerce-postgres",
  database: process.env.DB_NAME || "ecomdb",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432
});

export default pool;
