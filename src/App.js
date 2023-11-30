import { useState, useEffect, createContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import BACKEND_URL from "./constants.js";
import GlobalProvider from "./providers/globalProvider.js";
import ErrorPage from "./pages/errorPage.js";

//import pages here
import Homepage from "./pages/homePage.js";


const App = () => {
  return (
    <GlobalProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />

        {/* Fallback for any unmatched route */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </GlobalProvider>
  );
};

export default App;
