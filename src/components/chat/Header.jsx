// src/components/Header.js
import React from "react";

const Header = ({ user, handleLogout }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ margin: 0 }}>Welcome, {user?.email || "User"}</h2>
      <button
        onClick={handleLogout}
        style={{
          padding: "8px 16px",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
