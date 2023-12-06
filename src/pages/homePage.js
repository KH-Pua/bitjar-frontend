//-----------Libraries-----------//
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";
import axios from "axios";

//-----------Utilities-----------//
import BACKEND_URL from "../constants.js";

//-----------Media-----------//
import logo from "../media/bitjar-logo.png";

let web3;

export default function HomePage() {
  const {
    userWalletAdd,
    setUserWalletAdd,
  } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [account, setAccount] = useState("");
  const [verifyNewUserBool, setVerifyNewUserBool] = useState("");

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      console.log("these are the accounts: ", accounts);
      setAccount(accounts[0]);
      localStorage.setItem("connection_meta", accounts[0]);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  useEffect(() => {
    // Verify user info. If is new user redirect to onbording, else re-render sidebarWithHeader.
    const verifyUserInfo = async () => {
      try {
        let userInfo = await axios.post(`${BACKEND_URL}/users/getInfoViaWalletAdd`, {walletAddress: account});
        console.log(userInfo);
        //Set wallet address & profile picture to global state for passing around.
        setUserWalletAdd(userInfo.data.output.dataValues.walletAddress)
        // New user verification boolean
        setVerifyNewUserBool(userInfo.data.output.newUser)
      } catch (err) {
        console.error("Error verify user info:", err);
      };
    };

    if (account) {
      verifyUserInfo();
    };
  },[account])

  useEffect(() => {
    if (verifyNewUserBool && userWalletAdd) {
      console.log("new user created, redirect to onboarding page")
      navigate("/onboarding");
    } else {
      console.log("Existing user");
      navigate("/dashboard");
    };
  },[verifyNewUserBool, userWalletAdd])

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
        <button className="btn bg-yellow-200 hover:bg-yellow-300" onClick={() => connectWallet()}>
          Connect Wallet
        </button>
      </body>
    </>
  );
}
