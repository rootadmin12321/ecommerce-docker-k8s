import React from "react";
import "./ProductCard.css"; // optional extra styles

export default function ProductCard({ product }) {
  return (
    <div className="card shadow-sm p-3 mb-4 rounded" style={{ width: "18rem" }}>
      <img
        src={product.image_url}   // ✅ use image_url from database
        className="card-img-top"
        alt={product.title}       // use title for alt
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text text-muted">{product.description}</p>
        <p className="fw-bold">₹ {product.price}</p>
        <button className="btn btn-primary w-100">Add to Cart</button>
      </div>
    </div>
  );
}
