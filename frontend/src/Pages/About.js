import React from "react";
import { Card } from "react-bootstrap";

export default function About() {
  return (
    <div className="container mt-5">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Body className="p-5">
          <h1 className="fw-bold text-primary text-center mb-4">
            About Smart Reader
          </h1>
          <p className="lead text-muted text-center">
            Smart Reader is a multilingual text-to-speech platform built with
            modern web technologies. It transforms written content into natural
            voice, helping users read documents, articles, and translations with
            ease.
          </p>

          <hr className="my-4" />

          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <h4>🌍 Multilingual</h4>
              <p>Supports Arabic, Hebrew, and English with automatic detection.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h4>🧠 Smart Reading</h4>
              <p>Reads sentence-by-sentence with smooth transitions and controls.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h4>💡 Easy to Use</h4>
              <p>Upload text, click play, and enjoy natural voice playback.</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
