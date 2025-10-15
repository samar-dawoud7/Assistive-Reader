import React, { useState } from "react";
import './Style/style.css';

const ImageUploader = ({ onImageSelect }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      if (onImageSelect) onImageSelect(file);
    }
  };

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
