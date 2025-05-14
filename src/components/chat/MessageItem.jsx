// src/components/MessageItem.js
import React from "react";
import { formatRelative } from "date-fns";
import { auth } from "../../firebase"; // Adjust path if needed

const MessageItem = ({ message }) => {
  const isOwnMessage = message.uid === auth.currentUser?.uid;

  return (
    <div
      style={{
        alignSelf: isOwnMessage ? "flex-end" : "flex-start",
        backgroundColor: isOwnMessage ? "#DCF8C6" : "#f1f0f0",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "70%",
        marginBottom: "8px",
      }}
    >
      <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: "4px" }}>
        {message.displayName || "Anonymous"}
      </div>
      <div style={{ fontSize: "1rem", wordBreak: "break-word" }}>
        {message.text}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#999", textAlign: "right", marginTop: "5px" }}>
        {message.createdAt?.seconds
          ? formatRelative(new Date(message.createdAt.seconds * 1000), new Date())
          : "Just now"}
      </div>
    </div>
  );
};

export default MessageItem;
