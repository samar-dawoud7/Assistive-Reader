import { useState, useRef } from "react";
import { useCaption } from "../Components/CaptionContext";

export function useSpeechManager() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [voices, setVoices] = useState([]);
  const [currentVoice, setCurrentVoice] = useState(null);
  const utteranceRef = useRef(null);
  const { setCaptionText } = useCaption();

  // ✅ Load available voices once
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
      if (!currentVoice && allVoices.length > 0) setCurrentVoice(allVoices[0]);
    };
  }

  // ✅ Language detection
  const detectLanguage = (text) => {
    if (/[أ-ي]/.test(text)) return "ar-SA";
    if (/[א-ת]/.test(text)) return "he-IL";
    if (/[a-zA-Z]/.test(text)) return "en-US";
    return "en-US";
  };

  // ✅ Core reading logic
  const speakText = (text) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();

    // Split by lines → sentences → 10-word chunks
    const lines = text.split(/\n+/).filter(l => l.trim() !== "");
    let allChunks = [];
    for (const line of lines) {
      const sentences = line.match(/[^.!?]+[.!?]?/g) || [line];
      allChunks.push(...sentences);
    }

    const finalChunks = [];
    for (const chunk of allChunks) {
      const words = chunk.trim().split(/\s+/);
      if (words.length > 10) {
        for (let i = 0; i < words.length; i += 10) {
          finalChunks.push(words.slice(i, i + 10).join(" "));
        }
      } else {
        finalChunks.push(chunk.trim());
      }
    }

    let index = 0;

    const speakNext = () => {
      if (index >= finalChunks.length) {
        setIsSpeaking(false);
        setCaptionText("");
        return;
      }

      const current = finalChunks[index];
      const utterance = new SpeechSynthesisUtterance(current);
      utterance.lang = detectLanguage(current);
      utterance.rate = speechRate;
      utterance.pitch = 1;
      if (currentVoice) utterance.voice = currentVoice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCaptionText(current);
      };

      utterance.onend = () => {
        index++;
        setTimeout(speakNext, 400);
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
    };

    speakNext();
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCaptionText("");
  };

  const pauseSpeaking = () => {
    window.speechSynthesis.pause();
    setIsSpeaking(false);
  };

  const resumeSpeaking = () => {
    window.speechSynthesis.resume();
    setIsSpeaking(true);
  };

  return {
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isSpeaking,
    speechRate,
    setSpeechRate,
    voices,
    currentVoice,
    setCurrentVoice,
  };
}
