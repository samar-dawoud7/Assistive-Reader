import React, { createContext, useContext } from "react";
import { useSpeechManager } from "./useSpeechManager";

const SpeechContext = createContext(null);

export const SpeechProvider = ({ children }) => {
  const speech = useSpeechManager();
  return (
    <SpeechContext.Provider value={speech}>
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) throw new Error("useSpeech must be used inside SpeechProvider");
  return context;
};
