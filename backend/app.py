from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # enable CORS for all methods

pytesseract.pytesseract.tesseract_cmd = "/opt/homebrew/bin/tesseract"

@app.route("/extract-text", methods=["POST"])
def extract_text():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    img = Image.open(image_file)
    text = pytesseract.image_to_string(img)
    return jsonify({"text": text})

@app.route("/ping")
def ping():
    return "Pong!"

if __name__ == "__main__":
    app.run(debug=True, port=8000)  # make sure this port matches React fetch
