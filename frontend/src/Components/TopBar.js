import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useCaption } from "./CaptionContext";
import { useSpeechManager } from "../Hooks/useSpeechManager";

function TopBar() {
  const [speed, setSpeed] = useState(1);
  const { captionText, isVisible, toggleCaptions } = useCaption();

  // 🎯 Get the speech manager functions FIRST
  const {
    readSentence,
    stopSpeaking,
    togglePause,
    isSpeaking,
    handleSpeedChange,
  } = useSpeechManager();

  // 🧠 Refresh key to re-render button icon properly
  const [refreshKey, setRefreshKey] = useState(0);

  // 💡 Every time isSpeaking changes, re-render the play/pause button
  useEffect(() => {
    const timer = setTimeout(() => setRefreshKey(prev => prev + 1), 100);
    return () => clearTimeout(timer);
  }, [isSpeaking]);

  const handlePlayPause = () => {
    togglePause();
  };

  const handleStop = () => {
    stopSpeaking();
  };

  return (
    <>
      <nav
        className="navbar bg-light border-bottom shadow-sm px-4"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1030, height: "65px" }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-center">
          <div className="d-flex align-items-center justify-content-center flex-grow-1 my-2 my-md-0 sm-mx-5 ms-sm-5">
            <div className="d-flex align-items-center justify-content-center gap-3">

              

              {/* 🔁 The key ensures full re-render when isSpeaking toggles */}
              <button
                key={refreshKey}
                className="btn btn-primary rounded-circle"
                onClick={handlePlayPause}
                style={{ width: "45px", height: "45px" }}
              >
                <i className={`bi ${isSpeaking ? "bi-pause-fill" : "bi-play-fill"} fs-5 text-white`}></i>
              </button>

              <button className="btn btn-outline-danger rounded-circle" onClick={handleStop}>
                <i className="bi bi-stop-fill fs-5"></i>
              </button>


              <button className="btn btn-outline-secondary rounded-circle" onClick={handleSpeedChange}>
                <i className="bi bi-speedometer2 fs-6"></i>
              </button>

              <button className="btn btn-outline-secondary rounded-circle">
                <i className="bi bi-soundwave fs-6"></i>
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <button
              className={`btn ${isVisible ? "btn-secondary" : "btn-outline-secondary"} d-flex align-items-center`}
              onClick={toggleCaptions}
            >
              <i className="bi bi-subtitles me-2"></i>
              <span className="d-none d-md-inline">Captions</span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`captions ${isVisible ? "show" : ""}`}>
        {isVisible && (
          <div
           
            style={{ left: 160, right: 160, zIndex: 1050, transition: "opacity 0.3s ease-in-out" }}
          >
            {captionText || "Your Reading Text Will Be Shown Here."}
          </div>
        )}
      </div>
    </>
  );
}

export default TopBar;