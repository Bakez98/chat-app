// src/components/TypingIndicator.js
import React from "react";

const TypingIndicator = ({ typingUsers }) => {
  return (
    typingUsers.length > 0 && (
      <p style={{ fontStyle: "italic", color: "#666", marginBottom: "10px" }}>
        {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
      </p>
    )
  );
};

export default TypingIndicator;
