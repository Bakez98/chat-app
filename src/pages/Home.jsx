import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import ChatRoom from "./ChatRoom";

function Home({ user }) {
  const handleLogout = () => signOut(auth);

  return (
    <div>
      <div style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <span>Logged in as <strong>{user.email}</strong></span>
        <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Logout</button>
      </div>
      <ChatRoom user={user} />
    </div>
  );
}

export default Home;
