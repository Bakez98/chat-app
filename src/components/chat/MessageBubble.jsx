import React from "react";
import { format } from "date-fns";

function MessageBubble({ msg, isCurrentUser }) {
  const time = msg.createdAt?.toDate ? format(msg.createdAt.toDate(), "p") : "";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          background: isCurrentUser ? "#dcf8c6" : "#f1f1f1",
          padding: "10px",
          borderRadius: "15px",
          maxWidth: "60%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <img
            src={
              msg.photoURL ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200"
            }
            alt="User Avatar"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          <span style={{ fontSize: "0.8rem", color: "#888" }}>{msg.email}</span>
        </div>
        <div>{msg.text}</div>
        {time && (
          <div
            style={{
              fontSize: "0.75rem",
              textAlign: "right",
              marginTop: "4px",
              color: "#666",
            }}
          >
            {time}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
