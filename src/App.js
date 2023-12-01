//-----------Libraries-----------//
import React from "react";

//-----------Providers-----------//
import GlobalProvider from "./providers/globalProvider.js";
import Routes from "./providers/routerProvider.js";
//-----------Styling-----------//
import "./App.css";

const App = () => {
  return (
    <GlobalProvider>
      <Routes />
    </GlobalProvider>
  );
};

export default App;
