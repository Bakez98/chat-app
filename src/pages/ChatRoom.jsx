import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";
import { format } from "date-fns";

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [user, setUser] = useState(null);
  const dummyRef = useRef();
  const navigate = useNavigate();

  // Handle user auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Load messages only when user is authenticated
  useEffect(() => {
    if (!user) return; // Prevent running if user not ready

    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      dummyRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsubscribe();
  }, [user]);

  // Typing indicator listener
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, "typing"), (snapshot) => {
      const typing = [];
      snapshot.forEach((doc) => {
        if (doc.id !== user.uid) typing.push(doc.data().email);
      });
      setTypingUsers(typing);
    });

    return () => unsubscribe();
  }, [user]);

  // Cleanup typing status on unmount
  useEffect(() => {
    if (!user) return;

    const clearTyping = async () => {
      await deleteDoc(doc(db, "typing", user.uid));
    };

    window.addEventListener("beforeunload", clearTyping);
    return () => {
      clearTyping();
      window.removeEventListener("beforeunload", clearTyping);
    };
  }, [user]);

  // Handle typing input
  const handleTyping = async (text) => {
    setMessage(text);

    if (text) {
      await setDoc(doc(db, "typing", user.uid), {
        email: user.email,
        timestamp: serverTimestamp(),
      });
    } else {
      await deleteDoc(doc(db, "typing", user.uid));
    }
  };

  // Handle message send
  const handleSend = async (e) => {
    e.preventDefault();

    if (message.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: message,
      createdAt: serverTimestamp(),
      uid: user.uid,
      email: user.email,
    });

    setMessage("");
    await deleteDoc(doc(db, "typing", user.uid));
    dummyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
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
        {messages.map((msg) => {
          const time = msg.createdAt?.toDate
            ? format(msg.createdAt.toDate(), "p")
            : "";

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent:
                  msg.uid === user?.uid ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: msg.uid === user?.uid ? "#dcf8c6" : "#f1f1f1",
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
                      user?.photoURL ||
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
                  <span style={{ fontSize: "0.8rem", color: "#888" }}>
                    {msg.email}
                  </span>
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
        })}
        <div ref={dummyRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <p style={{ fontStyle: "italic", color: "#666", marginBottom: "10px" }}>
          {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
        </p>
      )}

      <form onSubmit={handleSend} style={{ display: "flex" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
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
            marginLeft: "10px",
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
    </div>
  );
}

export default ChatRoom;
