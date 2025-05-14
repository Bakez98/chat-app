import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatRoom from "./pages/ChatRoom";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        console.log("✅ User is logged in:", user.email);
      } else {
        console.log("❌ No user is logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/chat" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/chat" />}
        />
        <Route
          path="/chat"
          element={user ? <ChatRoom /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
