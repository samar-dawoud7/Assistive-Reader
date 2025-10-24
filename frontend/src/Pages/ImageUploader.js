import React, { useState, useEffect } from "react";
import '../Style/style.css';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ✅ Test backend connection when component mounts
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

  // ✅ Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  // ✅ Upload image and get extracted text
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);
      setExtractedText("");

      const res = await fetch("http://127.0.0.1:8000/extract-text", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Unknown error");
      }

      const data = await res.json();
      setExtractedText(data.text || "");

      // ✅ Automatically speak the extracted text
      if (data.text) {
        speakText(data.text);
      }

    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to read the text aloud
  const speakText = (text) => {
    if (!text) return;
    const synth = window.speechSynthesis;

    // Stop any current speech
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = detectLanguage(text); // detect language dynamically
    utterance.rate = 1; // normal speed
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  // ✅ Try to detect the language based on characters
  const detectLanguage = (text) => {
    if (/[أ-ي]/.test(text)) return "ar-SA"; // Arabic
    if (/[א-ת]/.test(text)) return "he-IL"; // Hebrew
    if (/[a-zA-Z]/.test(text)) return "en-US"; // English
    return "en-US"; // fallback
  };

  // ✅ Stop reading
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="container card  w-50 my-5 shadow-sm border-0 rounded ">
      <div className=" p-4 mx-auto" style={{width:"100%",height:"100%" }}>
        <h2 className=" text-center mb-2">Upload an Image</h2>
        <p className="text-center text-muted mb-3">
          Examples: Book page, street sign, product label
        </p>

        <div
          className="mb-3 border rounded d-flex align-items-center justify-content-center"
          style={{ height: "250px", backgroundColor: "#f8f9fa" }}
        >
          {image ? (
            <img
              src={image}
              alt="Preview"
              className="img-fluid h-100"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <span className="text-muted">No image selected</span>
          )}
        </div>

        <div className=" mb-3">
          <label className="btn btn-primary ">
            Choose Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
        </div>

        {/* Loading indicator */}
        {loading && <div className="alert alert-info text-center">Extracting text...</div>}

        {/* Error message */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Extracted text */}
        {!loading && extractedText && (
          <div className="mt-3">
            <h5>Extracted Text:</h5>
            <textarea
              className="form-control"
              rows={8}
              value={extractedText}
              readOnly
            />
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-success"
                onClick={() => speakText(extractedText)}
                disabled={isSpeaking}
              >
                🔊 Read Text
              </button>
              {isSpeaking && (
                <button className="btn btn-danger" onClick={stopSpeaking}>
                  ⏹ Stop
                </button>
              )}
            </div>
            <div className="alert alert-success mt-2">
              Text extracted successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
