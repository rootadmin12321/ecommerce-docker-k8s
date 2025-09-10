import React, { useEffect, useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Cart(){
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setItems(res.data);
    } catch (err) {
      setItems([]);
    }
  };

  useEffect(()=>{ fetchCart(); }, []);

  const remove = async (pid) => {
    await API.delete("/cart/" + pid);
    fetchCart();
  };

  const checkout = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    navigate("/checkout");
  };

  const total = items.reduce((s,i)=> s + Number(i.price) * i.quantity, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {items.length === 0 && <div>No items. <Link to="/">Shop now</Link></div>}
      <div>
        {items.map(it => (
          <div key={it.cart_id} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <img src={it.image_url || "https://via.placeholder.com/100"} style={{ width: 100, height: 80, objectFit: "cover" }}/>
            <div style={{ flex: 1 }}>
              <h4>{it.title}</h4>
              <p>₹{it.price} × {it.quantity}</p>
            </div>
            <div>
              <button onClick={() => remove(it.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <h3>Total: ₹{total.toFixed(2)}</h3>
      <button onClick={checkout} disabled={!items.length}>Proceed to Checkout</button>
    </div>
  );
}
