import { useEffect, useState, useRef } from "react";
import { useCaption } from "../Components/CaptionContext";

export const useSpeechManager = () => {
  const synth = window.speechSynthesis;
  const { setCaptionText } = useCaption();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");

  const rateRef = useRef(1);
  const utterRef = useRef(null);
  const sentencesRef = useRef([]);
  const currentIndexRef = useRef(0);// Track current sentence index

  // -------------------
  // Helpers
  // -------------------

  const setRate = (newRate) => {
    rateRef.current = newRate;
    if (utterRef.current) utterRef.current.rate = newRate;
  };

  const detectLanguage = (text) => {
    if (/[أ-ي]/.test(text)) return "ar-SA";
    if (/[א-ת]/.test(text)) return "he-IL";
    if (/[a-zA-Z]/.test(text)) return "en-US";
    return "en-US";
  };

  const processText = (text) => {
    if (!text) return [];
    const lines = text.split(/\n+/).filter(Boolean);
    let parts = [];
    for (const line of lines) {
      const sentences = line.match(/[^.!?]+[.!?]?/g) || [line];
      for (const sentence of sentences) {
        const words = sentence.trim().split(/\s+/);
        if (words.length > 10) {
          for (let i = 0; i < words.length; i += 10) {
            parts.push(words.slice(i, i + 10).join(" "));
          }
        } else {
          parts.push(sentence.trim());
        }
      }
    }
    return parts.filter(Boolean);
  };

  // -------------------
  // Speak text
  // -------------------

  const speakText = (textToSpeak = text) => {
    if (!textToSpeak) return;

    synth.cancel(); // stop any ongoing speech

    const sentences = processText(textToSpeak);
    if (sentences.length === 0) return;

    sentencesRef.current = sentences;

    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.lang = detectLanguage(textToSpeak);
    utter.rate = rateRef.current;
    utter.pitch = 1;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => {
      setIsSpeaking(false);
      setCaptionText("");
    };

    // Update captions dynamically
    utter.onboundary = (event) => {
      // We are updating caption per sentence
      const charIndex = event.charIndex;
      let cumulativeLength = 0;
      for (let i = 0; i < sentences.length; i++) {
        cumulativeLength += sentences[i].length + 1; // +1 for space/punctuation
        if (charIndex < cumulativeLength) {
          setCaptionText(sentences[i]);
          break;
        }
      }
    };

    utterRef.current = utter;
    synth.speak(utter);
  };

  // -------------------
  // Controls
  // -------------------

  const stopSpeaking = () => {
    synth.cancel();
    setIsSpeaking(false);
    setCaptionText("");
  };

  const togglePause = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsSpeaking(false);
    } else if (synth.paused) {
      synth.resume();
      setIsSpeaking(true);
    }
  };

   const nextSentence = () => {
  };

  const prevSentence = () => {
  };

  const handleSpeedChange = () => {
  const newRate = rateRef.current >= 2 ? 0.75 : parseFloat((rateRef.current + 0.25).toFixed(2));
  setRate(newRate);

  // If currently speaking, restart the current sentence at new rate
  if (utterRef.current && synth.speaking) {
    synth.cancel();
    speakText(currentIndexRef.current);
  }
};

  // Next/Prev can now be tricky with single utterance; you may slice text manually if needed

  useEffect(() => {
    if (text) speakText(text);
  }, [text]);

  return {
    setText,
    speakText,
    stopSpeaking,
    togglePause,
    setRate,
    isSpeaking,
    nextSentence,
    prevSentence,
    handleSpeedChange
  };
};


