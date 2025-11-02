import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function About() {
  return (
    <div className="min-vh-100 d-flex align-items-center main-content content">
      <Container className="py-5">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary mb-3">ℹ️ About Assistive Reader</h1>
          <p className="text-secondary fs-5 w-75 mx-auto">
            Assistive Reader is designed to make reading accessible, intuitive, and inclusive.
            Our goal is to empower everyone — students, readers, and visually impaired users — 
            to access text effortlessly, whether from images or typed content.
          </p>
        </div>

        {/* Principles Section */}
        <Row className="g-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100 rounded-4 p-4">
              <div className="display-6 mb-3">🎯</div>
              <h5 className="fw-bold mb-2">Accessibility First</h5>
              <p className="text-muted">
                Every feature is designed to ensure users with visual or reading challenges 
                can easily access and interact with text content.
              </p>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm h-100 rounded-4 p-4">
              <div className="display-6 mb-3">⚡</div>
              <h5 className="fw-bold mb-2">Fast & Intuitive</h5>
              <p className="text-muted">
                Users can upload images or type text manually and get instant 
                text-to-speech output with minimal steps.
              </p>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm h-100 rounded-4 p-4">
              <div className="display-6 mb-3">🌍</div>
              <h5 className="fw-bold mb-2">Multi-Language Support</h5>
              <p className="text-muted">
                Assistive Reader supports English and Arabic, ensuring a smooth multilingual experience.
              </p>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm h-100 rounded-4 p-4">
              <div className="display-6 mb-3">🔒</div>
              <h5 className="fw-bold mb-2">Privacy & Security</h5>
              <p className="text-muted">
                All text processing happens locally in your browser whenever possible, 
                keeping your data safe and private.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Closing / Credits Section */}
        <div className="text-center mt-5">
          <h4 className="fw-bold text-primary mb-3">Our Team</h4>
          <p className="text-muted fs-5 mb-2">
            This project was built with passion and care by Amro Tarter and Samar Dawoud.
          </p>
          <p className="text-muted fs-5">
            Check out the GitHub repository:{" "}
            <a
              href="https://github.com/samar-dawoud7/Assistive-Reader"
            >
            github Link </a>
          </p>
        </div>
      </Container>
    </div>
  );
}
