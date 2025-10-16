from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google.cloud import texttospeech

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