import { useEffect, useState } from "react";

import { formatWalletAddress } from "../../utilities/formatting";

import logo from "../../media/bitjar-logo.png";
import InfoTable from "./InfoTable";
import TierTable from "./TierTable";

const ProgressBar = ({ userData }) => {
  const [progress, setProgress] = useState(0);
  const [currentTier, setCurrentTier] = useState("");
  const [nextTier, setNextTier] = useState("");
  const [bonusPoints, setBonusPoints] = useState(0);
  const [nextTierPoints, setNextTierPoints] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

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
        <h1 className="flex flex-row items-center">
          <div className="m-1 flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-16 w-16 bg-white">
                <img src={profilePicture ? profilePicture : logo} alt="DP" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <p className=" text-xl font-bold">
              {userName && userName}{" "}
              <span className="font-normal">
                {formatWalletAddress(userData && walletAddress)}
              </span>
            </p>
            <p>
              {currentTier} tier : {points} points
            </p>
            <p>
              ({bonusPoints} bonus points added at end of season from{" "}
              {multiplier}x multiplier)
            </p>
          </div>
        </h1>
        <button
          className="mb-auto animate-pulse text-xs hover:font-semibold"
          onClick={() =>
            document.getElementById("points_info_modal").showModal()
          }
        >
          How to earn points?
        </button>
        <dialog id="points_info_modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-bold">How to earn points:</h3>
            <p className="bg-yellow-200 text-center">
              Hit your points milestones to get airdrop multipliers!
            </p>
            <TierTable />
            <p className="bg-yellow-200 text-center">
              Perform the following actions daily to rack up points!
            </p>
            <InfoTable />
          </div>
        </dialog>
      </header>
      <div className="h-4 w-full rounded-full bg-gray-600">
        <div
          className="h-full rounded-full bg-yellow-400"
          style={{ width: `${progress}` }}
        ></div>
      </div>
      <p>
        Earn {nextTierPoints} more points to reach{" "}
        <span className="font-bold">{nextTier}</span> tier
      </p>
    </div>
  );
};

export default ProgressBar;
