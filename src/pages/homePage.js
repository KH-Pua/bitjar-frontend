//-----------Libraries-----------//
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

//-----------Components-----------//
import InfoTable from "../components/rewards/InfoTable.js";
import TierTable from "../components/rewards/TierTable.js";
import ProductInfo from "../components/ProductCard/ProductInfo.js";
import ProfileImage from "../components/details/ProfileImage.js";
import Footer from "../components/details/Footer.js";

//-----------Media-----------//
import logo from "../media/bitjar-logo.png";
import logogif from "../media/BitJar-gif.gif";
import btcIcon from "cryptocurrency-icons/svg/color/btc.svg";

import spencerIcon from "../media/InvestorIcons/punk.jpg";
import gabicon from "../media/InvestorIcons/wonderpal.png";
import sqicon from "../media/InvestorIcons/gharliera-logo.jpg";

import githiredlogo from "../media/CompanyIcons/githiredLogo.png";
import paireduplogo from "../media/CompanyIcons/pairedUpLogo.png";
import moontradelogo from "../media/CompanyIcons/Eclipse.png";
import globalgemslogo from "../media/CompanyIcons/globalgems.png";
import powderfullogo from "../media/CompanyIcons/og-image.jpg";
import sessionslogo from "../media/CompanyIcons/sessions.png";

export default function HomePage() {
  const [assets, setAssets] = useState(42320232);
  const [interest, setInterest] = useState(250123);

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }} // Initial state (hidden and scaled down)
      animate={{ opacity: 1, scale: 1 }} // Final state (visible and at full scale)
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="flex w-full flex-col items-center justify-center"
    >
      <header className="sticky top-0 z-50 flex h-auto w-full flex-row justify-between gap-8 bg-white px-[1em] py-[.5em] align-bottom opacity-90 lg:px-[10em]">
        <figure className=" flex w-full origin-left flex-row items-center transition-all hover:scale-[1.05]">
          <div>
            <img
              src={logo}
              alt="BitJar Logo"
              className="w-[4em] -translate-y-1"
            />
          </div>
          <div>
            <h1 className="w-full translate-y-2 text-[2rem] font-semibold tracking-tight lg:text-[2.5rem]">
              Bitjar
            </h1>
          </div>
        </figure>
        <div className="flex flex-col justify-center ">
          <nav className="flex flex-row gap-2 ">
            <NavLink
              to="/"
              className="hover:translate-y-[-2px] hover:underline "
            >
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
        </div>
      </header>
      <main className="mt-[4.5em] flex flex-col items-center justify-center p-3 lg:mt-[3em]">
        <img
          src={logogif}
          alt="BitJar Logo"
          className=" mb-[2em] h-[14rem] lg:h-[18rem]"
        />
        <h1 className="text-center text-[42px] font-bold tracking-tighter text-black">
          Make your Bitcoin work harder with Bitjar
        </h1>
        <div className="text-center tracking-tighter">
          <p className="">
            Your one-stop shop for buying, swapping, and earning with your
            Bitcoin
            <img
              src={btcIcon}
              alt="bitcoin"
              className="ml-1 inline h-[18px] translate-y-[-3px]"
            />
          </p>
        </div>
      </main>
      <NavLink
        className="btn w-72 border-0 bg-yellow-300 text-lg hover:translate-y-[-2px] hover:bg-yellow-400"
        to="/dashboard"
      >
        Launch App →
      </NavLink>
      {/* AUM Section */}
      <section className="mt-5 flex w-full flex-col items-center justify-center pt-[1em] lg:flex-row">
        <figure className="m-2 flex w-[90%] flex-col items-center border bg-slate-50 pb-[1em] shadow-sm transition-all hover:bg-yellow-100 md:w-[50%] lg:w-[40%] xl:w-[30%]">
          <h1 className=" text-[3rem] font-bold text-yellow-400 md:text-[3rem] lg:text-[4rem]">
            ${assets.toLocaleString()}
          </h1>
          <h2 className="tracking-tighter">
            in assets deposited through Bitjar
          </h2>
        </figure>
        <figure className="m-2 flex w-[90%] flex-col items-center border bg-slate-50 pb-[1em] shadow-sm transition-all hover:bg-yellow-100 md:w-[50%] lg:w-[40%] xl:w-[30%] ">
          <h1 className=" text-[3rem] font-bold text-yellow-400 lg:text-[4rem]">
            ${interest.toLocaleString()}
          </h1>
          <h2 className="tracking-tighter">of crypto earned by users</h2>
        </figure>
      </section>
      {/* Products Section */}
      <section className="mt-5 flex flex-col items-center justify-center pt-[3em]">
        <h1 className="text-[42px] font-bold tracking-tighter">
          Deposit & Earn
        </h1>
        <p className="pb-[1em] tracking-tighter">
          Outperform HODL-ing the asset 📈
        </p>
        <ProductInfo />
        <p className="flex w-11/12 max-w-[600px] text-center text-[10px]">
          * Annual Percentage Yield (APY) is the current projected rate of
          interest on your cryptocurrency investment over a year. APR is subject
          to change at any time and the estimated earnings may be different from
          the actual earnings generated.
        </p>
        <NavLink
          to="/earn"
          className="btn mt-[1em] w-72 border-0 bg-yellow-300 text-lg hover:translate-y-[-2px] hover:bg-yellow-400"
        >
          Earn Crypto →
        </NavLink>
      </section>
      {/* Rewards Section */}
      <section className="m-4 flex flex-col items-center justify-center pt-[4em]">
        <article className=" m-4 flex flex-col items-center justify-center">
          <h1 className="text-[42px] font-bold tracking-tighter">
            Rewards Galore
          </h1>
          <p className="tracking-tighter">Score points with every action 🎯</p>
          <figure className=" mt-4">
            <InfoTable />
          </figure>
          <p className="pt-[2em] tracking-tighter">
            Reach higher tiers to get bonus points 💰
          </p>
          <figure className=" mt-4 ">
            <TierTable />
          </figure>
        </article>
        <NavLink
          to="/dashboard"
          className="btn w-72 border-0 bg-yellow-300 text-lg hover:translate-y-[-2px] hover:bg-yellow-400"
        >
          Score points →
        </NavLink>
      </section>
      {/* Backers Section */}
      <section className="m-4 flex w-full flex-col items-center justify-center pt-[4em]">
        <article className="flex w-full flex-col items-center justify-center">
          <h1 className="text-center text-[42px] font-bold tracking-tighter">
            Backed by institutional partners
          </h1>
          <p className="pb-[2em] tracking-tighter">
            Over 420,000,000 in SHIBA raised since inception 💰
          </p>
          <div className="mt-4 flex w-full flex-row justify-center">
            <ProfileImage src={spencerIcon} label="Spy Investments" />
            <ProfileImage src="/logos/spy.png" label="Spy Investments" />
            <ProfileImage src={sqicon} label="SQ Partners" />
            <ProfileImage src="/logos/kee.png" label="Kee Capital" />
            <ProfileImage src={gabicon} label="G Combinator" />
          </div>
        </article>
      </section>

      {/* Engineers Section */}
      <section className="m-4 flex flex-col items-center justify-center pt-[3em]">
        <article className=" flex flex-col items-center justify-center">
          <h1 className="text-center text-[42px] font-bold tracking-tighter">
            Built by the best engineers
          </h1>
          <p className="pb-[1em] tracking-tighter">
            Best-in-class infrastructure and design 👾
          </p>
          <div className="mt-4 grid grid-cols-3 gap-y-3 md:grid-cols-6">
            <ProfileImage src={sessionslogo} label="Sessions" />
            <ProfileImage src={powderfullogo} label="Powderful" />
            <ProfileImage src={globalgemslogo} label="globalgems" />
            <ProfileImage src={moontradelogo} label="Moontrade" />
            <ProfileImage src={paireduplogo} label="Paired Up" />
            <ProfileImage src={githiredlogo} label="GitHired" />
          </div>
        </article>
      </section>
      <Footer />
    </motion.div>
  );
}
