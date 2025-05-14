import React, { useState } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ImageUpload = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileRef = ref(storage, `chat-images/${file.name}_${Date.now()}`);
    setUploading(true);

    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        onUpload(url);
        setUploading(false);
      }
    );
  };

  return (
    <div style={{ marginLeft: "8px" }}>
      <label style={{ cursor: "pointer" }}>
        📎
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
      </label>
      {uploading && <span style={{ marginLeft: "5px" }}>Uploading...</span>}
    </div>
  );
};

export default ImageUpload;
