import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";
import NavBar from "../components/details/NavBar.js";

import logo from "../media/bitjar-logo.png";

export default function HomePage() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();

  const navigateTodashboard = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <header className="flex flex-row items-center justify-center px-3">
        <img src={logo} alt="BitJar Logo" className="h-24" />
        <h1 className="translate-y-[3px] text-[42px] font-bold text-black">
          BitJar
        </h1>
      </header>
      <br />
      <body className="flex flex-row items-center justify-center px-3">
        <button className="btn" onClick={navigateTodashboard}>
          Enter Dashboard
        </button>
      </body>
    </>
  );
}
