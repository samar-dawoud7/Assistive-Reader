import React, { useState, useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { useSpeech } from "../Hooks/SpeechContext";

function TextReader() {
  const { setText, isSpeaking } = useSpeech();
  const [inputText, setInputText] = useState("");

  // Update shared text whenever the user types
  useEffect(() => {
    setText(inputText);
  }, [inputText, setText]);

  return (
    <Container className="mt-5 text-center">
      <h2>🗣️ Text Reader (Browser Built-in)</h2>
      <Form.Group>
        <Form.Label>Enter or paste text below:</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type something to be read"
          disabled={isSpeaking} // optional: prevent editing while speaking
        />
      </Form.Group>
    </Container>
  );
}

export default TextReader;
