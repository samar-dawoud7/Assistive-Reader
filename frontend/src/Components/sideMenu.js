import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const SidebarWidthContext = React.createContext(150); // default width

function SideMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(150);

  useEffect(() => {
    const width = isCollapsed ? 60 : 150;
    setSidebarWidth(width);
  }, [isCollapsed]);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <SidebarWidthContext.Provider value={sidebarWidth}>
      {/* Toggle button */}
      <div className="buttonwrapper">
        <button
          className="btn btn-primary mt-3 position-fixed top-0 start-0"
          onClick={toggleSidebar}
          style={{ zIndex: 1100 }}
        >
          <i className="bi bi-list fs-5"></i>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className="bg-light border-end position-fixed top-0 start-0 p-3 vh-100 sidemenu"
        style={{
          width: isCollapsed ? "60px" : "150px",
          transform: isOpen || window.innerWidth >= 768 ? "translateX(0)" : "translateX(-100%)",
          transition: "all 0.3s ease",
          overflowX: "hidden",
        }}
      >
        <ul className="nav flex-column mt-5">
          <li className="nav-item mb-1">
            <Link to="/" className="nav-link text-dark d-flex align-items-center flex-column">
              <i className="bi bi-house-door fs-5"></i>
              {!isCollapsed && <span className="ms-2 text-center">Home</span>}
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link to="/imageuploader" className="nav-link text-dark d-flex align-items-center flex-column">
              <i className="bi bi-image fs-5"></i>
              {!isCollapsed && <span className="ms-2 text-center">Image Uploader</span>}
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link to="/text" className="nav-link text-dark d-flex align-items-center flex-column">
              <i className="bi bi-file-text fs-5"></i>
              {!isCollapsed && <span className="ms-2 text-center">Text Reader</span>}
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link to="/about" className="nav-link text-dark d-flex align-items-center flex-column">
              <i className="bi bi-info-circle fs-5"></i>
              {!isCollapsed && <span className="ms-2 text-center">About</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
          style={{ zIndex: 1050, backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      {children}
    </SidebarWidthContext.Provider>
  );
}

export default SideMenu;
