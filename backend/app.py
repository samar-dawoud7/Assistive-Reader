from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google.cloud import texttospeech
from fastapi import Body
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import io, base64, fitz
from docx import Document

from google.cloud import vision
import io
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "assistive-reader-8a6da4a0438a.json"


app = FastAPI()

# Allow frontend connection
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vision client
client = vision.ImageAnnotatorClient()

@app.get("/ping")
async def ping():
    return {"message": "Pong!"}

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = vision.Image(content=contents)

        # Use Vision API to extract text
        response = client.text_detection(image=image)

        if response.error.message:
            raise Exception(response.error.message)

        annotations = response.text_annotations
        if not annotations:
            return {"text": "", "language": None, "status": "no_text_found"}

        extracted_text = annotations[0].description.strip()

        # Use Vision API to detect language from text
        language_response = client.document_text_detection(image=image)
        detected_language = None
        if language_response.full_text_annotation and language_response.full_text_annotation.pages:
            # Vision AI provides language code in the first detected block
            blocks = language_response.full_text_annotation.pages[0].blocks
            if blocks and blocks[0].property.detected_languages:
                detected_language = blocks[0].property.detected_languages[0].language_code

        return {
            "text": extracted_text,
            "language": detected_language or "unknown",
            "status": "success"
        }

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/read-text")
async def read_text(data: dict):
    try:
        text = data.get("text", "")
        language = data.get("language", "en")

        if not text.strip():
            return JSONResponse(content={"error": "No text provided"}, status_code=400)

        tts_client = texttospeech.TextToSpeechClient()

        synthesis_input = texttospeech.SynthesisInput(text=text)

        # Map Vision AI language codes to TTS codes (simplified)
        voice = texttospeech.VoiceSelectionParams(
            language_code=language if len(language) == 2 else "en-US",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = tts_client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        return {
            "audio_content": response.audio_content.decode("ISO-8859-1"),
            "status": "success"
        }

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@app.post("/captions")
async def captions(data: dict = Body(...)):
    try:
        text = data.get("text", "").strip()
        if not text:
            return JSONResponse(content={"error": "No text provided"}, status_code=400)

        # Here you could also log or broadcast the caption if needed
        return {"caption": text, "status": "success"}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
    
@app.post("/extract-url")
async def extract_text_url(data: dict):
    image_url = data.get("image_url")
    if not image_url:
        return JSONResponse(content={"error": "No image URL provided"}, status_code=400)

    image = vision.Image()
    image.source.image_uri = image_url
    response = client.text_detection(image=image)
    annotations = response.text_annotations
    extracted_text = annotations[0].description.strip() if annotations else ""
    return {"text": extracted_text, "status": "success"}




@app.post("/extract-images")
async def extract_images(file: UploadFile = File(...)):
    import base64
    import fitz
    from docx import Document
    import io

    try:
        file_content = await file.read()
        file_type = file.filename.split(".")[-1].lower()
        images_data = []

        if file_type == "pdf":
            pdf = fitz.open(stream=file_content, filetype="pdf")
            for page_index in range(len(pdf)):
                page = pdf[page_index]
                for img_index, img in enumerate(page.get_images(full=True)):
                    xref = img[0]
                    base_image = pdf.extract_image(xref)
                    image_bytes = base_image["image"]
                    encoded = base64.b64encode(image_bytes).decode("utf-8")
                    images_data.append({
                        "page": page_index + 1,
                        "image_index": img_index + 1,
                        "image_data": encoded
                    })
            pdf.close()

        elif file_type == "docx":
            doc = Document(io.BytesIO(file_content))
            for rel in doc.part.rels.values():
                if "image" in rel.reltype:
                    image_data = rel.target_part.blob
                    encoded = base64.b64encode(image_data).decode("utf-8")
                    images_data.append({
                        "image_data": encoded
                    })

        else:
            return JSONResponse({"error": "Unsupported file type. Only PDF or DOCX allowed."}, status_code=400)

        if not images_data:
            return {"message": "No images found in the file."}

        return {"images": images_data}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)




@app.post("/extract-file-text")
async def extract_file_text(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        file_type = file.filename.split(".")[-1].lower()

        images_data = []

        # --- PDF Handling ---
        if file_type == "pdf":
            pdf = fitz.open(stream=file_content, filetype="pdf")
            for page_index in range(len(pdf)):
                page = pdf[page_index]
                for img_index, img in enumerate(page.get_images(full=True)):
                    xref = img[0]
                    base_image = pdf.extract_image(xref)
                    image_bytes = base_image["image"]
                    images_data.append(image_bytes)
            pdf.close()

        # --- DOCX Handling ---
        elif file_type == "docx":
            doc = Document(io.BytesIO(file_content))
            for rel in doc.part.rels.values():
                if "image" in rel.reltype:
                    image_data = rel.target_part.blob
                    images_data.append(image_data)

        else:
            return JSONResponse({"error": "Unsupported file type. Only PDF or DOCX allowed."}, status_code=400)

        if not images_data:
            return {"message": "No images found in the file."}

        # --- Extract text from each image using Vision API ---
        extracted_results = []
        for i, img_bytes in enumerate(images_data):
            image = vision.Image(content=img_bytes)
            response = client.text_detection(image=image)

            if response.error.message:
                continue  # skip image with error

            annotations = response.text_annotations
            extracted_text = annotations[0].description.strip() if annotations else ""

            language_response = client.document_text_detection(image=image)
            detected_language = None
            if language_response.full_text_annotation and language_response.full_text_annotation.pages:
                blocks = language_response.full_text_annotation.pages[0].blocks
                if blocks and blocks[0].property.detected_languages:
                    detected_language = blocks[0].property.detected_languages[0].language_code

            extracted_results.append({
                "image_index": i + 1,
                "text": extracted_text,
                "language": detected_language or "unknown",
            })

        return {
            "status": "success",
            "results": extracted_results
        }

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)