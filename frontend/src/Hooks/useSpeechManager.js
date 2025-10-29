import { useEffect, useState, useRef } from "react";
import { useCaption } from "../Components/CaptionContext";

export const useSpeechManager = () => {
  const synth = window.speechSynthesis;
  const { setCaptionText } = useCaption();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState("");
  const [rate, setRateState] = useState(1); // ✅ rate as state

  const rateRef = useRef(1);
  const utterRef = useRef(null);
  const sentencesRef = useRef([]);
  const currentIndexRef = useRef(0); // Track current sentence index

  // -------------------
  // Helpers
  // -------------------
  const setRate = (newRate) => {
    rateRef.current = newRate;
    setRateState(newRate); // ✅ update state too
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
       
          parts.push(sentence.trim());
        
      }
    }
    return parts.filter(Boolean);
  };

  // -------------------
  // Speak text
  // -------------------
  const speakText = (textToSpeak = text, startIndex = 0) => {
    if (!textToSpeak) return;

    synth.cancel(); // stop any ongoing speech

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
      // Move to the next automatically
      if (currentIndexRef.current < sentences.length - 1) {
        currentIndexRef.current++;
        speakText(textToSpeak, currentIndexRef.current);
      } else {
        setIsSpeaking(false);
        setCaptionText("");
      }
    };

    utter.onerror = () => setIsSpeaking(false);

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
// 🧭 Move to next or previous sentence
const speakSentenceAtIndex = (index) => {
  const sentences = sentencesRef.current;
  if (index < 0 || index >= sentences.length) return;

  currentIndexRef.current = index;
  const sentence = sentences[index];

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
    currentIndexRef.current = nextIndex;
    // continue full playback from the next sentence
    speakText(text, nextIndex);
  }
};

const prevSentence = () => {
  const prevIndex = currentIndexRef.current - 1;
  if (prevIndex >= 0) {
    currentIndexRef.current = prevIndex;
    speakText(text, prevIndex);
  }
};


  const handleSpeedChange = () => {
    const newRate =
      rateRef.current >= 2 ? 0.75 : parseFloat((rateRef.current + 0.25).toFixed(2));
    setRate(newRate);

    if (isSpeaking) {
      const currentIndex = currentIndexRef.current;
      synth.cancel();
      speakText(text, currentIndex);
    }
  };

 // Removed auto-speaking — text will only be spoken manually via Play button
// useEffect(() => {
//   if (text) speakText(text);
// }, [text]);

  return {
    text,
    setText,
    speakText,
    stopSpeaking,
    togglePause,
    setRate,
    isSpeaking,
    nextSentence,
    prevSentence,
    handleSpeedChange,
    rate,
  };
};
