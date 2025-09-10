import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function Product(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(()=>{ fetchProduct(); }, []);

  const fetchProduct = async () => {
    const res = await API.get(`/products/${id}`);
    setProduct(res.data);
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    await API.post("/cart", { product_id: product.id, quantity: qty });
    navigate("/cart");
  };

  if (!product) return <div>Loading...</div>;
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <img src={product.image_url || "https://via.placeholder.com/400"} style={{ width: 400, height: 400, objectFit: "cover" }} />
      <div>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p><b>Price:</b> ₹{product.price}</p>
        <p><b>Stock:</b> {product.stock}</p>
        <div>
          <input type="number" value={qty} min="1" max={product.stock} onChange={e=>setQty(Number(e.target.value))}/>
          <button onClick={addToCart}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
