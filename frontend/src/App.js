import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { setToken } from "./api";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <div className="app-container">
      {/* Navbar always visible */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main content */}
      <main style={{ minHeight: "80vh", padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Route for Checkout */}
          <Route
            path="/checkout"
            element={
              user ? <Checkout user={user} /> : <Navigate to="/login" replace />
            }
          />

          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register />} />

          {/* Catch-all route */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
