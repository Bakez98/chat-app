// src/components/MessageList.js
import React from "react";
import { format } from "date-fns";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, user }) => {
  return (
    <div
      style={{
        height: "400px",
        overflowY: "scroll",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        marginBottom: "20px",
        backgroundColor: "#fafafa",
      }}
    >
      {messages.map((msg) => (
  <MessageItem key={msg.id} message={msg} />
))}
    </div>
  );
};

export default MessageList;
