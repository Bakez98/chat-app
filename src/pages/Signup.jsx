import React, { useState } from "react";
import { auth, storage } from "../firebase";  // Import storage from firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";  // Import updateProfile for updating user's profile
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";  // Import Firebase storage functions
import { useNavigate } from "react-router-dom"; // Updated to useNavigate from react-router-dom v6+

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);  // Store selected image file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (image) {
        // Upload image to Firebase Storage under the user's UID
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload failed", error);
            setError("Image upload failed. Please try again.");
          },
          async () => {
            // Once the upload is complete, get the download URL of the image
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Update the user's profile with the uploaded image URL
            await updateProfile(user, {
              photoURL: downloadURL,
            });

            console.log("Profile updated with image URL", downloadURL);
          }
        );
      }

      console.log("User created:", user);
    } catch (err) {
      setError(err.message);  // Handle any errors (like email already in use)
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="file"
            onChange={handleImageChange}
            style={styles.fileInput}
          />
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.loginLinkContainer}>
          <p>Already have an account? <span onClick={() => navigate('/login')} style={styles.loginLink}>Login</span></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  fileInput: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "14px",
    cursor: "pointer",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
  loginLinkContainer: {
    marginTop: "20px",
  },
  loginLink: {
    color: "#4CAF50",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Signup;
