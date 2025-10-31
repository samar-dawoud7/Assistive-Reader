import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { useSpeech } from "../Hooks/SpeechContext";

function TextReader() {
  const { setText, isSpeaking, resetSpeech  } = useSpeech();
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e) => {
  resetSpeech();            // stop any ongoing speech
  setInputText(e.target.value);
  setText(e.target.value);
};

  // Update shared text whenever the user types
  useEffect(() => {
    setText(inputText);
  }, [inputText, setText]);

return (
  <Container className="text-center mt-5 pt-4">
    <div className="card shadow-lg border-0 rounded-4 p-4 mx-auto main-content" style={{ maxWidth: "700px" }}>
      <div className="mb-4">
        <i className="bi bi-megaphone text-primary fs-1"></i>
        <h3 className="fw-bold mt-2">🗣️ Text Reader</h3>
        <p className="text-muted">Type or paste text below to be read aloud</p>
      </div>

      <Form.Group className="mb-3 text-start">
        <Form.Label className="fw-semibold">Enter or paste text below:</Form.Label>
        <Form.Control
          as="textarea"
          rows={8}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste something..."
          className="shadow-sm"
          disabled={isSpeaking}
        />
      </Form.Group>

      
    </div>
  </Container>
);

}

export default TextReader;
