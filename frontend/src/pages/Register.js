import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const nav = useNavigate();
  const submit = async () => {
    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registered. Please login.");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Register failed");
    }
  };
  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Register</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><br/>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
      <button onClick={submit}>Register</button>
    </div>
  );
}
