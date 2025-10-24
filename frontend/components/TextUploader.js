import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

const TextUploader = () => {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/read-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (data.audio_url) {
        setAudioUrl("http://127.0.0.1:5000/" + data.audio_url);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Enter Text to Read Aloud</h3>
      <Card className="shadow p-4">
        <Form.Control
          as="textarea"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
        />
        <Button
          variant="primary"
          className="mt-3"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Audio"}
        </Button>

        {audioUrl && (
          <div className="mt-4">
            <audio controls src={audioUrl} className="w-100" />
          </div>
        )}
      </Card>
    </div>
  );
};

export default TextUploader;
