//-----------Libraries-----------//
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";

export default function SettingsPage() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    setAccount(localStorage.getItem("connection_meta"));
  },[])

  return (
    <div className="flex flex-row">
      <h1 className="p-0 text-3xl font-bold text-black">SettingsPage</h1>
    </div>
  );
}
