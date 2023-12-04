import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../constants";
import { MoonPayProvider } from "@moonpay/moonpay-react";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
  //Declare state here

  const infoToPass = {
    // Add other state or functions that you need to pass here
  };

  return (
    <GlobalContext.Provider value={infoToPass}>
      <MoonPayProvider
        apiKey={process.env.REACT_APP_MOONPAY_KEY}
        environment="sandbox"
        debug
      >
        {children}
      </MoonPayProvider>
    </GlobalContext.Provider>
  );
}
