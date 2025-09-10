import React from "react";

export default function Footer() {
  return (
    <footer style={{
      background: "#f8f9fa",
      textAlign: "center",
      padding: "15px",
      borderTop: "1px solid #e0e0e0",
      marginTop: "30px"
    }}>
      <p>© {new Date().getFullYear()} My E-Commerce Store. All Rights Reserved.</p>
    </footer>
  );
}
