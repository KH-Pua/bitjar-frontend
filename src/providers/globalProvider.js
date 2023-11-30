import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../constants";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
    //Declare state here

  const infoToPass = {
    // Add other state or functions that you need to pass here
  };

  return (
    <GlobalContext.Provider value={infoToPass}>
      {children}
    </GlobalContext.Provider>
  );
}