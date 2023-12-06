//-----------Libraries-----------//
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

//-----------Media-----------//
import logo from "../media/bitjar-logo.png";
import logogif from "../media/BitJar-gif.gif";
import InfoTable from "../components/rewards/InfoTable.js";
import TierTable from "../components/rewards/TierTable.js";

export default function HomePage() {
  const navigate = useNavigate();

  const navigateTodashboard = () => {
    navigate("/dashboard");
  };

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
          Your one-stop shop for buying, swapping and staking your Bitcoins 🪙
        </p>
      </main>
      <NavLink
        to="/dashboard"
        className="btn w-36 border-0 bg-yellow-200 hover:translate-y-[-2px] hover:bg-yellow-300"
      >
        Get started →
      </NavLink>
      {/* AUM Section */}
      <section className="mt-5 flex flex-col items-center sm:flex-row">
        <figure className="m-2 flex w-[400px] flex-col items-center rounded-lg bg-slate-100 p-3 hover:bg-slate-200">
          <h1 className="animate-pulse text-[64px] font-bold text-yellow-500">
            $41,200,232
          </h1>
          <h2 className="tracking-tighter">in assets held on Bitjar</h2>
        </figure>
        <figure className="m-2 flex w-[400px] flex-col items-center rounded-lg bg-slate-100 p-3 hover:bg-slate-200">
          <h1 className="animate-pulse text-[64px] font-bold text-yellow-500">
            $42,232
          </h1>
          <h2 className="tracking-tighter">
            in interest paid out to customers
          </h2>
        </figure>
      </section>
      {/* Products Section */}
      <section className="mt-5 flex flex-col items-center justify-center">
        <h1 className="text-[42px] font-bold tracking-tighter">Click & earn</h1>
        <p className="tracking-tighter">Maximise your long-term holdings 📈</p>

        <article className="m-4 flex flex-col gap-3 sm:flex-row">
          <figure className="flex h-[350px] w-[250px] flex-col items-center justify-center rounded-lg  bg-yellow-400 p-2">
            <h1 className="text-[24px] font-bold text-white">Bitcoin</h1>
            <h2> 1.45% APY</h2>
          </figure>
          <figure className="flex h-[350px] w-[250px] flex-col items-center justify-center  rounded-lg  bg-blue-200">
            <h1 className="text-[24px] font-bold text-white">Ethereum</h1>
            <h2> 3.04% APY</h2>
          </figure>
          <figure className="flex h-[350px] w-[250px] flex-col items-center justify-center rounded-lg  bg-blue-400">
            <h1 className="text-[24px] font-bold text-white">USDC</h1>
            <h2> 5.05% APY</h2>
          </figure>
        </article>
        <NavLink
          to="/earn"
          className="btn w-36 border-0 bg-yellow-200 hover:translate-y-[-2px] hover:bg-yellow-300"
        >
          Earn Interest →
        </NavLink>
      </section>
      {/* Rewards Section */}
      <section className="m-4 flex flex-col items-center justify-center">
        <article className=" m-4 flex flex-col items-center justify-center">
          <h1 className="text-[42px] font-bold tracking-tighter">
            Rewards galore
          </h1>
          <p className="tracking-tighter">Score points with every action 🎯</p>
          <figure className=" m-2 rounded-lg bg-slate-100">
            <InfoTable />
          </figure>
          <p className="tracking-tighter">
            Reach higher tiers to get bonus points 💰
          </p>
          <figure className=" m-2 rounded-lg bg-slate-100 ">
            <TierTable />
          </figure>
        </article>
        <NavLink
          to="/dashboard"
          className="btn w-36 border-0 bg-yellow-200 hover:translate-y-[-2px] hover:bg-yellow-300"
        >
          Score points →
        </NavLink>
      </section>

      {/* Rewards Section */}
      <section className="m-4 flex flex-col items-center justify-center">
        <article className=" m-4 flex flex-col items-center justify-center">
          <h1 className="text-[42px] font-bold tracking-tighter">
            Backed by institutional partners
          </h1>
          <p className="tracking-tighter">Spencer Investments </p>
          <p className="tracking-tighter">SQ Venture Partners</p>
          <p className="tracking-tighter">Kee Capital</p>
          <p className="tracking-tighter">G Combinator</p>
        </article>
      </section>
      <footer className="bottom-0 flex w-full justify-center p-2">
        <p className="text-xs">
          © 2023 Bitjar -{" "}
          <a
            href="https://github.com/KH-Pua/bitjar-frontend"
            target="_blank"
            className=" hover:underline"
            rel="noreferrer"
          >
            Github
          </a>
        </p>
      </footer>
    </motion.div>
  );
}
