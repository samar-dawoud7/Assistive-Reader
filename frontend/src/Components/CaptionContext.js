import React, { createContext, useContext, useState } from "react";

const CaptionContext = createContext();

export const useCaption = () => useContext(CaptionContext);

export const CaptionProvider = ({ children }) => {
  const [captionText, setCaptionText] = useState("Your Reading Text Will Be Shown Here.");
  const [isVisible, setIsVisible] = useState(false);

  const toggleCaptions = () => setIsVisible((prev) => !prev);

  return (
    <CaptionContext.Provider value={{ captionText, setCaptionText, isVisible, toggleCaptions }}>
      {children}
    </CaptionContext.Provider>
  );
};
