import React, { useState, useEffect } from "react";
import "../Style/style.css";
import { useSpeech } from "../Hooks/SpeechContext";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setText } = useSpeech();

  useEffect(() => {
    const testConnection = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/ping");
        const data = await res.json();
        console.log("Backend says:", data.message);
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
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);
      setExtractedText("");

      const res = await fetch("http://127.0.0.1:8000/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to extract text");

      const data = await res.json();
      setExtractedText(data.text || "");

      if (data.text) setText(data.text); // 👈 hook will auto-speak
      //if (data.text) speakText(data.text); // 🔊 delegate to hook

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container card w-50 my-5 shadow-sm border-0 rounded">
      <div className="p-4 mx-auto">
        <h2 className="text-center mb-2">Upload an Image</h2>
        <p className="text-center text-muted mb-3">
          Examples: Book page, street sign, product label
        </p>

        <div
          className="mb-3 border rounded d-flex align-items-center justify-content-center"
          style={{ height: "250px", backgroundColor: "#f8f9fa" }}
        >
          {image ? (
            <img src={image} alt="Preview" className="img-fluid h-100" style={{ objectFit: "contain" }} />
          ) : (
            <span className="text-muted">No image selected</span>
          )}
        </div>

        <div className="mb-3">
          <label className="btn btn-primary">
            Choose Image
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>
        </div>

        {loading && <div className="alert alert-info text-center">Extracting text...</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {!loading && extractedText && (
          <div className="mt-3">
            <h5>Extracted Text:</h5>
            <textarea className="form-control" rows={8} value={extractedText} readOnly />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
