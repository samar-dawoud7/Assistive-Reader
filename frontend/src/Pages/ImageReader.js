import React, { useState,useEffect } from "react";
import { Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useSpeechManager } from "../Hooks/useSpeechManager";
import { useSpeech } from "../Hooks/SpeechContext";

export default function ImageReader() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setText, isSpeaking } = useSpeech();


  
  useEffect(() => {
    setText(extractedText);
  }, [extractedText, setText]);



  const backendUrl = "http://127.0.0.1:8000";



  // 🌐 Extract text from image URL
  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) {
      setError("Please enter a valid image URL.");
      return;
    }

    console.log("🔹 Image URL entered:", imageUrl);

    setError("");
    setLoading(true);
    setExtractedText("");

    try {
      console.log("🚀 Sending request to backend:", `${backendUrl}/extract-url`);

      const response = await fetch(`${backendUrl}/extract-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      console.log("📬 Response status:", response.status);

      const data = await response.json();
      console.log("📦 Response JSON:", data);

      if (data.error) throw new Error(data.error);

      if (data.text) {
        console.log("✅ Text extracted successfully!");
        setExtractedText(data.text);
      } else {
        console.warn("⚠️ No text detected in image URL.");
        setExtractedText("(No text detected)");
      }
    } catch (err) {
      console.error("❌ Error during URL extraction:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log("🏁 Finished URL extraction process.");
    }
  };

  return (
    <div className="container  w-50 main-content">
      <Card className="shadow-lg border-0 rounded-4 p-4 mt-5">
        <h2 className="fw-bold text-center text-primary mb-4">
          🧠 Extract Text from Image URL
        </h2>

        <Form>
       

          {/* Extract from image URL */}
          <Form.Group className="mb-3 text-center">
            <Form.Label className="fw-semibold">Enter Image URL:</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-2"
            />
            <Button
              variant="primary"
              className="mt-3"
              onClick={handleUrlSubmit}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Extract from URL"}
            </Button>
          </Form.Group>
        </Form>

        {error && <Alert variant="danger" className="mt-4 text-center">{error}</Alert>}

        {extractedText && (
          <div className="mt-4">
            <h5 className="fw-bold">📄 Extracted Text:</h5>
            <Card className="p-3 bg-light border-0 shadow-sm">
              <pre style={{ whiteSpace: "pre-wrap" }}>{extractedText}</pre>
            </Card>

          </div>
        )}
      </Card>
    </div>
  );
}
