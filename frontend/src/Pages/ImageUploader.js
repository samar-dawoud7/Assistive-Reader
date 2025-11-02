import React, { useState, useEffect } from "react";
import "../Style/style.css";
import { useSpeech } from "../Hooks/SpeechContext";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setText ,resetSpeech} = useSpeech();

  const handleExtractedText = (result) => {
  resetSpeech();           // ✅ stop old speech
  setText(result);         // set new text globally
};
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
  <div className="container py-5 d-flex justify-content-center align-items-start main-content ">
    <div className="card shadow-lg border-0 rounded-4 p-4 w-100" style={{ maxWidth: "650px" }}>
      <div className="text-center mb-4">
        <i className="bi bi-image text-primary fs-1 mb-2"></i>
        <h3 className="fw-bold">Upload an Image</h3>
        <p className="text-muted">Extract text from book pages, labels, or signs</p>
      </div>

      {/* Preview Area */}
      <div
        className="mb-3 border border-2 rounded-4 d-flex align-items-center justify-content-center bg-light"
        style={{
          height: "260px",
          borderStyle: "dashed",
          borderColor: "#ced4da",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="img-fluid h-100 rounded-3"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div className="text-muted text-center">
            <i className="bi bi-cloud-upload fs-1 d-block mb-2"></i>
            <p className="mb-0">No image selected</p>
          </div>
        )}
      </div>

      {/* Choose Button */}
      <div className="text-center mb-4">
        <label className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold shadow-sm">
          <i className="bi bi-folder2-open me-2"></i>Choose Image
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </label>
      </div>

      {/* Loading / Error / Text */}
      {loading && (
        <div className="alert alert-info text-center mb-3 shadow-sm">
          <i className="bi bi-hourglass-split me-2"></i>Extracting text...
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center mb-3 shadow-sm">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
        </div>
      )}

      {!loading && extractedText && (
        <div>
          <h5 className="fw-semibold mb-2">
            <i className="bi bi-file-text me-2 text-success"></i>Extracted Text:
          </h5>
          <textarea
            className="form-control shadow-sm rounded-3"
            rows={8}
            value={extractedText}
            readOnly
          />
        </div>
      )}
    </div>
  </div>
);

};

export default ImageUploader;
