import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Checkout({ user }) {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      await API.post("/orders", { address });
      alert("Order placed!");
      navigate("/");
    } catch (err) {
      alert("Failed to place order");
    }
  };

  if (!user) return <div>Please login to checkout</div>;

  return (
    <div>
      <h2>Checkout</h2>
      <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Shipping address" style={{ width: "100%", height: 120 }} />
      <br/>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}