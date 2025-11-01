import { useState, useRef } from "react";
import { useCaption } from "../Components/CaptionContext";

export const useSpeechManager = () => {
  const synth = window.speechSynthesis;
  const { setCaptionText } = useCaption();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [rate, setRateState] = useState(1);
  const [onPlaybackEnd, setOnPlaybackEnd] = useState(null);

  const rateRef = useRef(1);
  const utterRef = useRef(null);
  const sentencesRef = useRef([]);
  const currentIndexRef = useRef(0);
  const currentTextRef = useRef(""); // ✅ always store latest text

  // -------------------
  // Reset Speech
  // -------------------
  const resetSpeech = () => {
    synth.cancel();
    setIsSpeaking(false);
    setCaptionText("");
    currentIndexRef.current = 0;
    sentencesRef.current = [];
    utterRef.current = null;
  };

  // -------------------
  // Helpers
  // -------------------
  const setRate = (newRate) => {
    rateRef.current = newRate;
    setRateState(newRate);
    if (utterRef.current) utterRef.current.rate = newRate;
  };

  const detectLanguage = (text) => {
    if (/[أ-ي]/.test(text)) return "ar-SA";
    if (/[א-ת]/.test(text)) return "he-IL";
    if (/[a-zA-Z]/.test(text)) return "en-US";
     if (/[àâçéèêëîïôûùüÿñæœ]/i.test(text)) return "fr-FR";

    // Spanish (ñ, á, é, í, ó, ú, ü)
    if (/[ñáéíóúü¿¡]/i.test(text)) return "es-ES";

    // German (ä, ö, ü, ß)
    if (/[äöüß]/i.test(text)) return "de-DE";

    // Russian (Cyrillic)
    if (/[\u0400-\u04FF]/.test(text)) return "ru-RU";

    // Chinese (Simplified)
    if (/[\u4e00-\u9fff]/.test(text)) return "zh-CN";

    // Japanese (Hiragana, Katakana, Kanji)
    if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(text)) return "ja-JP";

    // Korean (Hangul)
    if (/[\uac00-\ud7af]/.test(text)) return "ko-KR";

    // Hindi / Devanagari
    if (/[\u0900-\u097F]/.test(text)) return "hi-IN";

    // Italian (common accented characters)
    if (/[àèéìíîòóùú]/i.test(text)) return "it-IT";

    // Portuguese (ã, õ, ç, é, í, ó, ú)
    if (/[ãõçéíóú]/i.test(text)) return "pt-PT";
    return "en-US";
  };
// to add some more languages



  const processText = (text) => {
    if (!text) return [];
    const lines = text.split(/\n+/).filter(Boolean);
    const parts = [];
    for (const line of lines) {
      const sentences = line.match(/[^.!?]+[.!?]?/g) || [line];
      for (const sentence of sentences) {
        parts.push(sentence.trim());
      }
    }
    return parts.filter(Boolean);
  };

  // -------------------
  // Speak text (main)
  // -------------------
  const speakText = (textToSpeak = text, startIndex = 0) => {
    if (!textToSpeak || !textToSpeak.trim()) return;

    // ✅ Cancel old speech immediately before starting new
    synth.cancel();
    resetSpeech();

    // ✅ Always store latest text for next/prev controls
    currentTextRef.current = textToSpeak;
    setText(textToSpeak);

    const sentences = processText(textToSpeak);
    if (sentences.length === 0) return;

    sentencesRef.current = sentences;
    currentIndexRef.current = startIndex;

    const currentSentence = sentences[startIndex];
    const utter = new SpeechSynthesisUtterance(currentSentence);

    utter.lang = detectLanguage(currentSentence);
    utter.rate = rateRef.current;
    utter.pitch = 1;

    utter.onstart = () => {
      setIsSpeaking(true);
      setCaptionText(currentSentence);
    };

    utter.onend = () => {
      // If user has changed the text mid-playback, stop.
      if (currentTextRef.current !== textToSpeak) {
        resetSpeech();
        return;
      }

      if (currentIndexRef.current < sentences.length - 1) {
        currentIndexRef.current++;
        speakText(textToSpeak, currentIndexRef.current);
      } else {
        setIsSpeaking(false);
        setCaptionText("");
        onPlaybackEnd?.();
      }
    };

    utter.onerror = () => {
      setIsSpeaking(false);
      setCaptionText("");
      onPlaybackEnd?.();
    };

    utterRef.current = utter;
    synth.speak(utter);
  };

  // -------------------
  // Controls
  // -------------------
// ✅ Forcefully stops speech, clears queue, and resets everything
const stopSpeaking = () => {
  try {
    // Cancel ALL queued utterances immediately
    synth.cancel();

    // Double safeguard: if synth is still speaking, cancel again in a short delay
    setTimeout(() => {
      if (synth.speaking) synth.cancel();
    }, 30);

    // Clear all internal refs and state
    setIsSpeaking(false);
    setCaptionText("");
    currentIndexRef.current = 0;
    sentencesRef.current = [];
    utterRef.current = null;
  } catch (err) {
    console.error("Error stopping speech:", err);
  }
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

  const speakSentenceAtIndex = (index) => {
    const sentences = sentencesRef.current;
    if (index < 0 || index >= sentences.length) return;

    currentIndexRef.current = index;
    const sentence = sentences.slice(index);

    synth.cancel();
    const utter = new SpeechSynthesisUtterance(sentence);
    utter.lang = detectLanguage(sentence);
    utter.rate = rateRef.current;
    utter.pitch = 1;

    utter.onstart = () => {
      setIsSpeaking(true);
      setCaptionText(sentence);
    };
    utter.onend = () => {
      setIsSpeaking(false);
    };

    utterRef.current = utter;
    synth.speak(utter);
  };

  const nextSentence = () => {
    const nextIndex = currentIndexRef.current + 1;
    if (nextIndex < sentencesRef.current.length) {
      
      speakText(currentTextRef.current, nextIndex);
    }
  };

  const prevSentence = () => {
    const prevIndex = currentIndexRef.current - 1;
    if (prevIndex >= 0) {
      
      speakText(currentTextRef.current, prevIndex);
    }
  };

  const handleSpeedChange = () => {
    const newRate =
      rateRef.current >= 2 ? 0.75 : parseFloat((rateRef.current + 0.25).toFixed(2));
    setRate(newRate);
    if (isSpeaking) {
      const currentIndex = currentIndexRef.current;
      synth.cancel();
      speakText(currentTextRef.current, currentIndex);
    }
  };

  // ✅ Return everything needed
  return {
    text,
    setText,
    speakText,
    stopSpeaking,
    togglePause,
    resetSpeech,
    setRate,
    isSpeaking,
    nextSentence,
    prevSentence,
    handleSpeedChange,
    setOnPlaybackEnd,
    rate,
  };
};
