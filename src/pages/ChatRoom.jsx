import React, { useEffect, useState, useRef } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, setDoc, doc, deleteDoc } from "firebase/firestore";
import { format } from "date-fns";

// Import Components
import Header from "../components/chat/Header";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import TypingIndicator from "../components/chat/TypingIndicator";
import EmojiPicker from "emoji-picker-react";

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dummyRef = useRef();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!user) return;

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

  const handleImageUpload = (imageUrl) => {
  const messageData = {
    text: "",
    imageUrl,
    createdAt: serverTimestamp(),
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };

  const messagesRef = collection(db, "messages");
  addDoc(messagesRef, messageData);
};

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

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Header user={user} handleLogout={handleLogout} />
      <MessageList messages={messages} user={user} />
      <TypingIndicator typingUsers={typingUsers} />
      <MessageInput
  message={message}
  setMessage={setMessage}
  handleSend={handleSend}
  handleTyping={handleTyping} // ✅ THIS LINE MUST EXIST
/>


    </div>
  );
}

export default ChatRoom;
