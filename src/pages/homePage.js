//-----------Libraries-----------//
import { useState, useEffect, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Web3 from "web3";
import axios from "axios";
//-----------Components-----------//
import InfoTable from "../components/rewards/InfoTable.js";
import TierTable from "../components/rewards/TierTable.js";
import ProductInfo from "../components/ProductCard/ProductInfo.js";
import ProfileImage from "../components/details/ProfileImage.js";

//-----------Utilities-----------//
import { GlobalContext } from "../providers/globalProvider.js";
import BACKEND_URL from "../constants.js";
import { signUpPoints } from "../utilities/pointsMessages.js";

//-----------Media-----------//
import logo from "../media/bitjar-logo.png";
import logogif from "../media/BitJar-gif.gif";
import gabicon from "../media/InvestorIcons/wonderpal.png";
import githiredlogo from "../media/CompanyIcons/githiredLogo.png";
import paireduplogo from "../media/CompanyIcons/pairedUpLogo.png";
import moontradelogo from "../media/CompanyIcons/Eclipse.png";
import globalgemslogo from "../media/CompanyIcons/globalgems.png";
import powderfullogo from "../media/CompanyIcons/og-image.jpg";
import sessionslogo from "../media/CompanyIcons/sessions.png";

let web3;

export default function HomePage() {
  const { userWalletAdd, setUserWalletAdd } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [assets, setAssets] = useState(42320232);
  const [interest, setInterest] = useState(250123);

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

  // Web3 Instance
  useEffect(() => {
    //Check for web3 wallet
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    }
  }, []);

  useEffect(() => {
    //Set time interval
    const interval = setInterval(() => {
      const randomIncrement = Math.floor(Math.random() * (500 - 10 + 1)) + 10;

      setAssets((prevAmount) => prevAmount + randomIncrement);
    }, 1000);

    const altInterval = setInterval(() => {
      const randomIncrement = Math.floor(Math.random() * (5 - 1 + 1)) + 1;

      setInterest((prevAmount) => prevAmount + randomIncrement);
    }, 1500);

    return () => clearInterval(interval, altInterval);
  }, []);

  useEffect(() => {
    // Verify user info. If is new user redirect to onbording, else re-render sidebarWithHeader.
    const verifyUserInfo = async () => {
      try {
        let userInfo = await axios.post(
          `${BACKEND_URL}/users/getInfoViaWalletAdd`,
          { walletAddress: account },
        );
        console.log(userInfo);

        //Set wallet address & profile picture to global state for passing around.
        setUserWalletAdd(userInfo.data.output.dataValues.walletAddress);

        // New user verification boolean
        setVerifyNewUserBool(userInfo.data.output.newUser);
      } catch (err) {
        console.error("Error verify user info:", err);
      }
    };

    if (account) {
      verifyUserInfo();
    }
  }, [account]);

  useEffect(() => {
    // Record transactions when sign up
    async function recordSignupTransaction() {
      try {
        await axios.post(
          `${BACKEND_URL}/transactions/points/add/`,
          signUpPoints(userWalletAdd),
        );
      } catch (err) {
        console.log(err);
      }
    }

    if (verifyNewUserBool && userWalletAdd) {
      console.log("new user created, redirect to onboarding page");
      recordSignupTransaction();
      navigate("/onboarding");
    } else if (verifyNewUserBool === false) {
      console.log("Existing user");
      navigate("/dashboard");
    }
  }, [verifyNewUserBool, userWalletAdd]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }} // Initial state (hidden and scaled down)
      animate={{ opacity: 1, scale: 1 }} // Final state (visible and at full scale)
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="flex flex-col items-center justify-center "
    >
      <header className="fixed top-0 z-50 flex w-11/12 flex-row items-center justify-between bg-white opacity-90 sm:w-10/12">
        <figure className="flex flex-row items-center hover:scale-[1.03]">
          <img src={logo} alt="BitJar Logo" className="h-16" />
          <h1 className="translate-y-2 text-[36px] font-semibold tracking-tight">
            Bitjar
          </h1>
        </figure>
        <nav className="flex flex-row gap-3">
          <NavLink to="/" className="hover:translate-y-[-2px] hover:underline">
            Home
          </NavLink>
          <NavLink
            to="/buy"
            className="hover:translate-y-[-2px] hover:underline"
          >
            Buy
          </NavLink>
          <NavLink
            to="/earn"
            className="hover:translate-y-[-2px] hover:underline"
          >
            Earn
          </NavLink>
          <NavLink
            to="/rewards"
            className="hover:translate-y-[-2px] hover:underline"
          >
            Rewards
          </NavLink>
        </nav>
      </header>
      <main className="mt-[130px] flex flex-col items-center justify-center p-3">
        <img src={logogif} alt="BitJar Logo" className=" h-44" />
        <h1 className="text-center text-[42px] font-bold tracking-tighter text-black">
          Make your Bitcoin work harder with Bitjar
        </h1>
        <p className="text-center tracking-tighter">
          Your one-stop shop for buying, swapping and earning with your Bitcoins
          🪙
        </p>
      </main>
      <button
        className="btn w-72 border-0 bg-yellow-300 text-lg hover:translate-y-[-2px] hover:bg-yellow-400"
        onClick={connectWallet}
      >
        Sign Up / Sign In with Wallet
      </button>
      {/* AUM Section */}
      <section className="mt-5 flex flex-col items-center sm:flex-row">
        <figure className="m-2 flex w-[500px] flex-col items-center border bg-slate-50 pb-[1em] shadow-sm transition-all hover:bg-yellow-100">
          <h1 className=" text-[60px] font-bold text-yellow-400">
            ${assets.toLocaleString()}
          </h1>
          <h2 className="tracking-tighter">
            in assets deposited through Bitjar
          </h2>
        </figure>
        <figure className="m-2 flex w-[500px] flex-col items-center border bg-slate-50 pb-[1em] shadow-sm transition-all hover:bg-yellow-100">
          <h1 className=" text-[60px] font-bold text-yellow-400">
            ${interest.toLocaleString()}
          </h1>
          <h2 className="tracking-tighter">of crypto earned by users</h2>
        </figure>
      </section>
      {/* Products Section */}
      <section className="mt-5 flex flex-col items-center justify-center">
        <h1 className="text-[42px] font-bold tracking-tighter">
          Deposit & Earn
        </h1>
        <p className="tracking-tighter">Outperform HODL-ing the asset 📈</p>
        <ProductInfo />
        <NavLink
          to="/earn"
          className="btn w-72 border-0 bg-yellow-300 text-lg hover:translate-y-[-2px] hover:bg-yellow-400"
        >
          Earn Crypto →
        </NavLink>
      </section>
      {/* Rewards Section */}
      <section className="m-4 flex flex-col items-center justify-center">
        <article className=" m-4 flex flex-col items-center justify-center">
          <h1 className="text-[42px] font-bold tracking-tighter">
            Rewards Galore
          </h1>
          <p className="tracking-tighter">Score points with every action 🎯</p>
          <figure className=" mt-4">
            <InfoTable />
          </figure>
          <p className="tracking-tighter">
            Reach higher tiers to get bonus points 💰
          </p>
          <figure className=" mt-4 ">
            <TierTable />
          </figure>
        </article>
        <NavLink
          to="/dashboard"
          className="btn w-72 border-0 bg-yellow-200 text-lg hover:translate-y-[-2px] hover:bg-yellow-300"
        >
          Score points →
        </NavLink>
      </section>
      {/* Backers Section */}
      <section className="m-4 flex flex-col items-center justify-center">
        <article className=" flex flex-col items-center justify-center">
          <h1 className="text-[42px] font-bold tracking-tighter">
            Backed by institutional partners
          </h1>
          <p className="tracking-tighter">
            Over 420,000,000 in SHIBA raised since inception 💰
          </p>
          <div className="mt-4 flex flex-row justify-center">
            <ProfileImage src="/logos/spy.png" label="Spy Investments" />
            <ProfileImage src="/logos/sq.png" label="SQ Partners" />
            <ProfileImage src="/logos/kee.png" label="Kee Capital" />
            <ProfileImage src={gabicon} label="G Combinator" />
          </div>
        </article>
      </section>

      {/* Engineers Section */}
      <section className="m-4 flex flex-col items-center justify-center">
        <article className=" flex flex-col items-center justify-center">
          <h1 className="text-[42px] font-bold tracking-tighter">
            Built by the best engineers
          </h1>
          <p className="tracking-tighter">
            Best-in-class infrastructure and design 👾
          </p>
          <div className="mt-4 flex flex-row justify-center">
            <ProfileImage src={sessionslogo} label="Sessions" />
            <ProfileImage src={powderfullogo} label="Powderful" />
            <ProfileImage src={globalgemslogo} label="globalgems" />
            <ProfileImage src={moontradelogo} label="Moontrade" />
            <ProfileImage src={paireduplogo} label="Paired Up" />
            <ProfileImage src={githiredlogo} label="GitHired" />
          </div>
        </article>
      </section>

      <footer className="bottom-2 flex w-full justify-center p-2">
        <p className="text-sm">
          © 2023 Bitjar -{" "}
          <a
            href="https://github.com/KH-Pua/bitjar-frontend"
            target="_blank"
            className=" text-sm hover:underline"
            rel="noreferrer"
          >
            Github -{" "}
          </a>
          <a
            href="https://twitter.com/bitjarxyz"
            target="_blank"
            className=" text-sm hover:underline"
            rel="noreferrer"
          >
            Twitter
          </a>
        </p>
      </footer>
    </motion.div>
  );
}
