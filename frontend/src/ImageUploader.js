import React, { useState } from "react";
import './Style/style.css';
import { useEffect } from "react";

const ImageUploader = ({ onImageSelect }) => {

  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");


  useEffect(() => {
    const testConnection = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/ping");
        const text = await res.text();
        console.log("Backend says:", text);
      } catch (err) {
        console.error("Error connecting to backend:", err);
      }
    };
  
    testConnection();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/extract-text", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setExtractedText(data.text);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

//   handleImageChange → triggered when user uploads image.
// uploadImage → sends the image to Flask backend.
// setExtractedText → saves and displays extracted text.

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "450px" }}>
        <h2 className="card-title text-center mb-2">Upload an Image</h2>
        <p className="text-center text-muted mb-3">
          Examples: Book page, street sign, product label
        </p>

        <div className="mb-3 border rounded d-flex align-items-center justify-content-center"
             style={{ height: "250px", backgroundColor: "#f8f9fa" }}>
          {image ? (
            <img src={image} alt="Preview" className="img-fluid h-100" style={{ objectFit: "contain" }} />
          ) : (
            <span className="text-muted">No image selected</span>
          )}
        </div>

        <div className="d-grid">
          <label className="btn btn-primary">
            Choose Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
