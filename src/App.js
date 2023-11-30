//-----------Libraries-----------//
import React from "react";

//-----------Providers-----------//
import GlobalProvider from "./Providers/GlobalProvider.js";
import Routes from "./Providers/RouterProvider.js";
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
