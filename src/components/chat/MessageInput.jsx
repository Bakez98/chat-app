// src/components/chat/MessageInput.jsx
import React, { useState } from "react";
import { FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ message, setMessage, handleSend, handleTyping }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    handleTyping(value);
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const newText = message + emoji;
    setMessage(newText);
    if (typeof handleTyping === "function") {
      handleTyping(newText);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}
    >
      <button
        type="button"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        style={{
          background: "transparent",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
        }}
        title="Add emoji"
      >
        <FaSmile />
      </button>

      {showEmojiPicker && (
        <div style={{ position: "absolute", bottom: "60px", left: "20px", zIndex: 1000 }}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
