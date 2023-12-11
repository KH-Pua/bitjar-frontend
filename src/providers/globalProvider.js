import React, { useState, createContext } from "react";
import { MoonPayProvider } from "@moonpay/moonpay-react";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
  const [userWalletAdd, setUserWalletAdd] = useState("");
  const [userProfilePicture, setUserProfilePicture] = useState("");

  const infoToPass = {
    userWalletAdd,
    setUserWalletAdd,
    userProfilePicture,
    setUserProfilePicture,
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
