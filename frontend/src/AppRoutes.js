// AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import ImageUploader from "./Pages/ImageUploader";
import TextReader from "./Pages/TextReader";
import Home from "./Pages/Home";
import About from "./Pages/About";
import ImageReader from "./Pages/ImageReader";

function AppRoutes() {
  return (
 
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/imageuploader" element={<ImageUploader />} />
      <Route path="/text" element={<TextReader />} />
      <Route path="/About" element={<About />} />
      <Route path="/imagereader"  element={<ImageReader />}/>
   
    </Routes>
  
  );
}

export default AppRoutes;
