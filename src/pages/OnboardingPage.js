//-----------Libraries-----------//
import { useState, useEffect, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../Providers/GlobalProvider.js";

//-----------Components-----------//
import NavBar from "../components/details/NavBar.js";

export default function OnboardingPage() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-row">
      <div className="flex w-screen flex-col items-center justify-center">
        <h1 className="p-0 text-xs text-black">Onboarding Page</h1>
      </div>{" "}
    </div>
  );
}
