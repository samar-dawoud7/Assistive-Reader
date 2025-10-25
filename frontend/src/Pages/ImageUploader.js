import React, { useState, useEffect } from "react";
import '../Style/style.css';
import { useCaption } from "../Components/CaptionContext"

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { setCaptionText, isVisible } = useCaption();

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
  if (synth.speaking) synth.cancel();

  // 1️⃣ Split text by new lines first
  const lines = text.split(/\n+/).filter(line => line.trim() !== "");

  // 2️⃣ Then split each line by sentences (. ! ?)
  let allChunks = [];
  for (const line of lines) {
    const sentences = line.match(/[^.!?]+[.!?]?/g) || [line];
    allChunks.push(...sentences);
  }

  // 3️⃣ Finally, break long sentences (>10 words) into smaller parts
  const finalChunks = [];
  for (const chunk of allChunks) {
    const words = chunk.trim().split(/\s+/);
    if (words.length > 10) {
      for (let i = 0; i < words.length; i += 10) {
        finalChunks.push(words.slice(i, i + 10).join(" "));
      }
    } else {
      finalChunks.push(chunk.trim());
    }
  }

  let index = 0;

  const speakNext = () => {
    if (index >= finalChunks.length) {
      setIsSpeaking(false);
      setCaptionText("");
      return;
    }

    const current = finalChunks[index];
    const utterance = new SpeechSynthesisUtterance(current);
    utterance.lang = detectLanguage(current);
    utterance.rate = 1;
    utterance.pitch = 1;

    // ✅ Fade transition for smoother caption change
    const captionEl = document.querySelector(".captions-bar");
    if (captionEl) {
      captionEl.classList.add("captions-fade");
      setTimeout(() => {
        captionEl.classList.remove("captions-fade");
        setCaptionText(current);
      }, 250);
    } else {
      setCaptionText(current);
    }

    utterance.onstart = () => setIsSpeaking(true);

    utterance.onend = () => {
      index++;
      setTimeout(speakNext, 400); // brief pause between chunks
    };

    synth.speak(utterance);
  };

  speakNext();
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
