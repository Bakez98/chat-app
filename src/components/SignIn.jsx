// src/pages/SignIn.js
import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate('/chat'); // Redirect to chat after successful login
    } catch (error) {
      console.error('Error during sign-in', error);
    }
  };

  return (
    <div className="sign-in">
      <h2>Welcome to the Chat App</h2>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;
