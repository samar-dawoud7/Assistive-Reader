from flask import Flask, request, jsonify
from flask_cors import CORS  # ← import CORS
from PIL import Image
import pytesseract
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # ← enable CORS for all routes

# Endpoint to handle image upload and return extracted text
@app.route("/extract-text", methods=["POST"])
def extract_text():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    img = Image.open(image_file)

    # OCR: extract text
    text = pytesseract.image_to_string(img)

    return jsonify({"text": text})

@app.route("/ping")
def ping():
    return "Pong!"

if __name__ == "__main__":
    app.run(debug=True, port=8000)  # ← your custom port
