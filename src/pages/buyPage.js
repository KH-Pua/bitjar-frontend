import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";
import NavBar from "../components/details/NavBar.js";

export default function BuyPage() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-row">
      <h1 className="p-0 text-3xl font-bold text-black">BuyPage</h1>
    </div>
  );
}