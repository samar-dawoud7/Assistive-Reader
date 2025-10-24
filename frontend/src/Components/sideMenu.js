import React, { useState } from "react";
import { Link } from "react-router-dom";

function SideMenu() {
  const [isOpen, setIsOpen] = useState(false); // for small screens
  const [isCollapsed, setIsCollapsed] = useState(false); // for desktop

  return (
    <>
      {/* Toggle button - for all screens */}
      <div className="buttonwrapper  "> 
      <button
        className="btn btn-primary mt-3 position-fixed top-0 start-0 ms-"
        onClick={() => {
          if (window.innerWidth < 768) {
            // Mobile → open/close sidebar
            setIsOpen(!isOpen);
          } else {
            // Desktop → collapse/expand sidebar
            setIsCollapsed(!isCollapsed);
          }
        }}
        style={{ zIndex: 1100 }}
      >
        <i className="bi bi-list fs-5"></i>
      </button>
      </div>
      {/* Sidebar */}
      <div
        className="bg-light border-end  position-fixed top-0 start-0 p-3 vh-100"
        style={{
          width: isCollapsed ? "60px" : "150px", // collapse width on desktop
          transform:
            isOpen || window.innerWidth >= 768
              ? "translateX(0)"
              : "translateX(-100%)", // hide on mobile when closed
          transition: "all 0.3s ease",
          zIndex: 1099,
          overflowX: "hidden",
        }}
      >
        <ul className="nav flex-column mt-5 ">
          <li className="nav-item mb-1">
            <Link
              to="/"
              className="nav-link text-dark d-flex align-items-center flex-column"
            >
              <i className="bi bi-house-door fs-5"></i>
              {!isCollapsed && <span className="ms-2 text-center">Home</span>}
            </Link>
          </li>

          <li className="nav-item mb-1 ">
            <Link
              to="/imageuploader"
              className="nav-link text-dark d-flex align-items-center flex-column justify-content-center "
            >
              <i className="bi bi-image fs-5"></i>
              {!isCollapsed && <span className="ms-2 text-center">Image Uploader</span>}
            </Link>
          </li>

          <li className="nav-item mb-1">
            <Link
              to="/text"
              className="nav-link text-dark d-flex align-items-center flex-column"
            >
              <i className="bi bi-file-text fs-5"></i>
              {!isCollapsed && <span className="ms-2 text-center">Text Reader</span>}
            </Link>
          </li>

          <li className="nav-item mb-1">
            <Link
              to="/about"
              className="nav-link text-dark d-flex align-items-center flex-column"
            >
              <i className="bi bi-info-circle fs-5"></i>
              {!isCollapsed && <span className="ms-2 text-center">About</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay for small screens */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
          style={{
            zIndex: 1050,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default SideMenu;

