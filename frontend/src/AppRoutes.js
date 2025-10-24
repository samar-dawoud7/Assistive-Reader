// AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import ImageUploader from "./Pages/ImageUploader";
import TextReader from "./Pages/TextReader";

function AppRoutes() {
  return (
 
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/imageuploader" element={<ImageUploader />} />
      <Route path="/text" element={<TextReader />} />
   
    </Routes>
  
  );
}

export default AppRoutes;
