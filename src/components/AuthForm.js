import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Registered:", userCred.user.email);
    } catch (err) {
      console.error("❌ Sign-up error:", err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in:", userCred.user.email);
    } catch (err) {
      console.error("❌ Login error:", err.message);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
}

export default AuthForm;
