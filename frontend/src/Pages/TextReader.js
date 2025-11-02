import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { useSpeech } from "../Hooks/SpeechContext";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function TextReader() {
  const { setText, isSpeaking } = useSpeech();
  const [inputText, setInputText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setText(inputText);
  }, [inputText, setText]);

  // 🔹 Extract text from TXT files
  const extractTextFromTxt = async (file) => {
    const text = await file.text();
    return text.trim();
  };

  // 🔹 Extract text from DOCX
  const extractTextFromDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  // 🔹 Extract text from PDF (including OCR fallback)
// ✅ Extract text from PDF (handles normal + scanned pages)
const extractTextFromPDF = async (file) => {
  // Dynamically import pdf.js correctly (no deprecated worker path)
  const pdfjsLib = await import("pdfjs-dist");
  const workerSrc = await import("pdfjs-dist/build/pdf.worker.mjs");

  pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
    new Blob([`importScripts('${workerSrc.default}')`], { type: "text/javascript" })
  );

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let extractedText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");

    // 🧠 Fallback to OCR if no selectable text
    if (pageText.trim() === "") {
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      const ocrResult = await Tesseract.recognize(canvas, "eng", {
        logger: (info) => console.log("OCR progress:", info.progress),
      });

      extractedText += ocrResult.data.text + "\n\n";
    } else {
      extractedText += pageText + "\n\n";
    }
  }

  return extractedText.trim();
};



  // 🔹 Extract text from image files (JPG/PNG)
  const extractTextFromImage = async (file) => {
    const imageUrl = URL.createObjectURL(file);
    const result = await Tesseract.recognize(imageUrl, "eng", {
      logger: (info) => console.log(info),
    });
    return result.data.text.trim();
  };

  // 🔹 Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setInputText("");

    const ext = file.name.split(".").pop().toLowerCase();

    try {
      let extractedText = "";

      if (ext === "pdf") extractedText = await extractTextFromPDF(file);
      else if (ext === "docx") extractedText = await extractTextFromDocx(file);
      else if (ext === "txt") extractedText = await extractTextFromTxt(file);
      else if (["png", "jpg", "jpeg"].includes(ext))
        extractedText = await extractTextFromImage(file);
      else {
        alert("Unsupported file type. Try PDF, DOCX, TXT, PNG, or JPG.");
        setLoading(false);
        return;
      }

      setInputText(extractedText || "⚠️ No readable text found in this file.");
    } catch (err) {
      console.error("Error extracting text:", err);
      alert("Error reading the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 text-center main-content">
      <div
        className="card shadow-lg border-0 rounded-4 p-4 mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <div className="mb-4">
          <i className="bi bi-megaphone text-primary fs-1"></i>
          <h3 className="fw-bold mt-2">🗣️ Smart Text Reader</h3>
          <p className="text-muted">
            Type, paste, or upload a file — even scanned PDFs or images.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Extracting text... please wait.</p>
          </div>
        ) : (
          <>
            <Form.Group className="mb-3 text-start">
              <Form.Label className="fw-semibold">Enter or paste text:</Form.Label>
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

            <div className="d-flex justify-content-between align-items-center">
              <Form.Group controlId="formFile" className="text-start">
                <Form.Label className="fw-semibold">Upload a file:</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  disabled={isSpeaking}
                />
                {fileName && (
                  <p className="text-muted mt-1 small">📁 {fileName}</p>
                )}
              </Form.Group>

              <Button
                variant="outline-primary"
                onClick={() => setInputText("")}
                disabled={!inputText || loading}
              >
                Clear Text
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default TextReader;
