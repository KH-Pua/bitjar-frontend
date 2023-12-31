//-----------Libraries-----------//
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

//-----------Components-----------//
import InfoTable from "./InfoTable";
import TierTable from "./TierTable";

//-----------Utilities-----------//
import { formatWalletAddress } from "../../utilities/formatting";

//-----------Media-----------//
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import logo from "../../media/bitjar-logo.png";

const ProgressBar = ({ userData }) => {
  const [progress, setProgress] = useState(0);
  const [currentTier, setCurrentTier] = useState("");
  const [nextTier, setNextTier] = useState("");
  const [bonusPoints, setBonusPoints] = useState(0);
  const [nextTierPoints, setNextTierPoints] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const [windowWidth, setWindowWidth] = useState(null);

  function reportWindowSize() {
    let widthOutput = window.innerWidth;
    setWindowWidth(widthOutput);
  }
  window.addEventListener("resize", reportWindowSize);

  const { userName, walletAddress, points, profilePicture } = userData;

  const calculateProgress = (currentPoints) => {
    let nextTierPoints = 0;
    let progress = 0;
    let currentTier = "";
    let nextTier = "";
    let multiplier = 1;
    let bonusPoints = 0;
    let totalPoints = 0;

    if (currentPoints > 100000) {
      currentTier = "Diamond";
      nextTier = "No further Tiers";
      multiplier = 3;
    } else if (currentPoints > 10000) {
      currentTier = "Platinum";
      nextTier = "Diamond";
      nextTierPoints = 100000 - currentPoints;
      progress = currentPoints / 100000;
      multiplier = 2;
    } else if (currentPoints > 1000) {
      currentTier = "Gold";
      nextTier = "Platinum";
      nextTierPoints = 10000 - currentPoints;
      progress = currentPoints / 10000;
      multiplier = 1.5;
    } else {
      currentTier = "Silver";
      nextTier = "Gold";
      nextTierPoints = 1000 - currentPoints;
      progress = currentPoints / 1000;
    }

    bonusPoints = (multiplier - 1) * currentPoints;
    totalPoints = currentPoints + bonusPoints;

    setCurrentTier(currentTier);
    setNextTier(nextTier);
    setNextTierPoints(nextTierPoints);
    setProgress(`${progress * 100}%`);
    setMultiplier(multiplier);
    setBonusPoints(bonusPoints);
    setTotalPoints(totalPoints);
  };

  // Trigger calculations
  useEffect(() => {
    if (userData) {
      calculateProgress(points);
    }
  }, [userData]);

  return (
    <div>
      <header className="flex flex-row justify-between">
        <h1 className="flex flex-row items-center gap-[1em]">
          <div className=" flex items-center">
            <div className="avatar">
              <div className="h-16 w-16 rounded-full bg-white hover:scale-110">
                <img src={profilePicture ? profilePicture : logo} alt="DP" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <p className=" text-xl font-bold">
              {userName && userName}
              {"  "}
              <span className="font-semibold text-slate-600">
                {formatWalletAddress(userData && walletAddress)}
              </span>
            </p>
            <p className="text-[12px] font-bold sm:text-base">
              {currentTier} Tier : {points} Points
            </p>
            <p className="text-[12px] sm:text-base">
              (<span className="font-bold">{bonusPoints}</span> bonus points at
              end of season from {multiplier}x multiplier)
            </p>
          </div>
        </h1>

        <dialog id="points_info_modal" className="modal">
          <div className="modal-box ">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="mb-2 text-lg font-bold">How to earn points:</h3>
            <p className="mb-2 bg-yellow-200 p-1 text-center text-sm">
              Hit your milestones and get multipliers! 🎯
            </p>
            <TierTable />
            <p className="mb-2 bg-yellow-200 p-1 text-center text-sm">
              Daily actions to rack up points! 📈
            </p>
            <InfoTable />
          </div>
        </dialog>
      </header>
      <div className="my-[1em] h-5 w-full rounded-full bg-gray-600 ">
        <motion.div
          className="h-full rounded-full bg-yellow-400 hover:animate-pulse"
          style={{ width: `${progress}` }}
          initial={{ width: "0%" }} // Initial width set to 0%
          animate={{ width: `${progress}` }} // Animate to the specified width
          transition={{ duration: 3 }} // Transition duration
        ></motion.div>
      </div>
      <div className="text-right">
        <p className="text-[12px] sm:text-base">
          <span className="animate-pulse font-bold text-sky-800">
            {nextTierPoints.toFixed(2)}{" "}
          </span>
          more points to reach
          <span className="font-bold"> {nextTier}!</span>
        </p>

        <button
          className="mb-auto scale-100 text-[.9rem] text-slate-600 transition-all hover:scale-95"
          onClick={() =>
            document.getElementById("points_info_modal").showModal()
          }
        >
          {windowWidth <= 1024 ? null : "How To Earn Points"}
          <QuestionMarkCircleIcon className="ml-[.5em] inline h-5 w-5 -translate-y-[0.5px] text-slate-600" />
        </button>
      </div>
    </div>
  );
};

export default ProgressBar;
