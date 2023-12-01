//-----------Libraries-----------//
import { useState, useEffect, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../Providers/GlobalProvider.js";

//-----------Components-----------//
import NavBar from "../components/details/NavBar.js";

export default function SettingsPage() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-row">
      <aside>
        <NavBar />
      </aside>
      <h1 className="p-0 text-xs text-black">Settings Page</h1>
    </div>
  );
}
