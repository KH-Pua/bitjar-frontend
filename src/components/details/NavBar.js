//-----------Libraries-----------//
import React from "react";

//-----------Components-----------//
import NavBarButton from "./NavBarButton";

//-----------Media-----------//
import logo from "../../media/bitjar-logo.png";
import homeLogo from "../../media/home.png";

const NavBar = () => {
  return (
    <div className="flex h-screen flex-col bg-yellow-50">
      <header className="flex flex-row items-center justify-center  px-3">
        <img src={logo} alt="BitJar Logo" className="h-24" />
        <h1 className="translate-y-[3px] text-[42px] font-bold text-black">
          BitJar
        </h1>
      </header>
      <main className="px-4 py-2">
        <NavBarButton logo={homeLogo} title="Home" nav="/" />
        <NavBarButton logo={homeLogo} title="Market" nav="/market" />
        <NavBarButton logo={homeLogo} title="Earn" nav="/earn" />
        <NavBarButton logo={homeLogo} title="Swap" nav="/swap" />
        <NavBarButton logo={homeLogo} title="Buy" nav="/buy" />
        <NavBarButton logo={homeLogo} title="Rewards" nav="/rewards" />
      </main>
      <footer className="mt-auto px-4 py-2">
        <p className="rounded-lg bg-yellow-300 p-1 text-center">
          Referral Id: 000001
        </p>
        <NavBarButton logo={homeLogo} title="Settings" nav="/settings" />
      </footer>
    </div>
  );
};

export default NavBar;
