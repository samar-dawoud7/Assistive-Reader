import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function Home() {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container className="py-5">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary mb-3">
            📖 Smart Reader
          </h1>
          <p className="text-secondary fs-5 w-75 mx-auto">
            Smart Reader is your intelligent text-to-speech companion. 
            Whether you upload an image or type text manually, Smart Reader 
            reads it aloud naturally — supporting English, Arabic, and Hebrew seamlessly.
          </p>
        </div>

        {/* Feature Cards */}
        <Row className="g-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100 rounded-4">
              <Card.Body className="text-center p-4">
                <div className="display-6 mb-3">🖼️</div>
                <h5 className="fw-bold mb-2">Image Text Extraction</h5>
                <p className="text-muted">
                  Upload an image containing text — like a book page or sign — 
                  and Smart Reader automatically extracts and prepares it for reading.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100 rounded-4">
              <Card.Body className="text-center p-4">
                <div className="display-6 mb-3">🗣️</div>
                <h5 className="fw-bold mb-2">Natural Voice Reading</h5>
                <p className="text-muted">
                  Listen to your text spoken aloud in a clear, human-like voice 
                  directly in your browser — no downloads needed.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100 rounded-4">
              <Card.Body className="text-center p-4">
                <div className="display-6 mb-3">🌍</div>
                <h5 className="fw-bold mb-2">Multi-Language Support</h5>
                <p className="text-muted">
                  Automatically detects and reads text in English, Arabic, or Hebrew. 
                  Enjoy a smooth multilingual experience with just one click.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Closing Section */}
        <div className="text-center mt-5">
          <h4 className="fw-bold text-primary mb-3">Why Smart Reader?</h4>
          <p className="text-muted w-75 mx-auto fs-5">
            Smart Reader is designed to make reading accessible to everyone — 
            students, readers, and visually impaired users.  
            With a clean interface and instant speech, it turns text into sound effortlessly.
          </p>
        </div>
      </Container>
    </div>
  );
}
