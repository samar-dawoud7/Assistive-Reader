import React, { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button for small screens */}
      {/* <button
        className="btn btn-primary m-3 d-md-none"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        ☰ Menu
      </button> */}

        {/* ✅ Floating Menu Button - visible only on mobile */}
        <button
        className={`menu-btn ${isOpen ? "open" : ""} d-md-none btn-primary`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar */}
      <nav className={`sidebar bg-light ${isOpen ? "show" : ""} `}>
        <h4 className="text-muted ms-3 h4-color">Assistive Reader</h4>
        <ul className="nav flex-column mt-3">
          <li className="nav-item">
          <Link to="/" className="nav-link text-muted fw-bold">🏠 Home</Link>
          </li>


          <li className="nav-item">
            <Link to="/imageuploader" className="nav-link text-muted fw-bold">🖼️ Upload Image</Link>
          </li>

          <li className="nav-item">
            <Link to="/imagereader" className="nav-link text-muted fw-bold"> 🌐 Image URl</Link>
          </li>

          <li className="nav-item">
          <Link to="/text" className="nav-link text-muted fw-bold">📖 Text Reader</Link>
          </li>


          <li className="nav-item">
          <Link to="/about" className="nav-link text-muted fw-bold">  ℹ️ About</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;
