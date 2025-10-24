import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function TopBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showCaptions, setShowCaptions] = useState(false);


  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const toggleCaptions = () => {
    setShowCaptions(!showCaptions);
  };

  return (
    <>
    <nav
      className="navbar bg-light border-bottom shadow-sm px-4"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1030,
        height: "65px",
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-center">
  {/* Left */}
  <div className="d-flex align-items-center">
  </div>

  {/* Center */}
  <div className="d-flex align-items-center justify-content-center flex-grow-1  my-2 my-md-0 sm-mx-5 ms-sm-5">
    {/* أزرار التشغيل هنا */}
        {/* 🎧 منتصف: أدوات التحكم بالقراءة */}
        <div className="d-flex align-items-center justify-content-center gap-3">
          {/* السابق */}
          <button className="btn btn-outline-secondary rounded-circle">
            <i className="bi bi-skip-start-fill fs-5"></i>
          </button>

          {/* تشغيل / إيقاف */}
          <button
            className="btn btn-primary rounded-circle"
            onClick={togglePlay}
            style={{ width: "45px", height: "45px" }}
          >
            <i
              className={`bi ${
                isPlaying ? "bi-pause-fill" : "bi-play-fill"
              } fs-5 text-white`}
            ></i>
          </button>

          {/* التالي */}
          <button className="btn btn-outline-secondary rounded-circle">
            <i className="bi bi-skip-end-fill fs-5"></i>
          </button>

          {/* سرعة القراءة */}
          <button className="btn btn-outline-secondary rounded-circle">
            <i className="bi bi-speedometer2 fs-6"></i>
          </button>

          {/* اختيار الصوت */}
          <button className="btn btn-outline-secondary rounded-circle">
            <i className="bi bi-soundwave fs-6"></i>
          </button>
        </div>
  </div>

    


          {/* Right */}
         {/* For Captions */}

  <div className="d-flex align-items-center">
  <button
            className={`btn ${
              showCaptions ? "btn-secondary" : "btn-outline-secondary"
            } d-flex align-items-center`}
            onClick={toggleCaptions}
          >
            <i className="bi bi-subtitles me-2"></i>
            <span className="d-none d-md-inline">Captions</span>
          </button>
  </div>
     
            
            
     </div>
    </nav>

  
    <div className={`captions ${showCaptions ? "show" : ""}`}>
        <i className="bi bi-chat-square-text me-2"></i>
        Your Reading Text Will Be Shown Here.
      </div>

</> 
  );
}

export default TopBar;
