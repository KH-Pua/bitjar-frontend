import { useEffect, useState } from "react";

import { formatWalletAddress } from "../../utilities/formatting";

import logo from "../../media/bitjar-logo.png";

const ProgressBar = ({ userData }) => {
  const [progress, setProgress] = useState(0);
  const [currentTier, setCurrentTier] = useState("");
  const [nextTier, setNextTier] = useState("");
  const [nextTierPoints, setNextTierPoints] = useState(0);

  const { userName, walletAddress, points, profilePicture } = userData;

  const calculateProgress = (currentPoints) => {
    let nextTierPoints = 0;
    let progress = 0;
    let currentTier = "";
    let nextTier = "";

    if (currentPoints > 100000) {
      currentTier = "Diamond";
      nextTier = "No further Tiers";
    } else if (currentPoints > 10000) {
      currentTier = "Platinum";
      nextTier = "Diamond";
      nextTierPoints = 100000 - currentPoints;
      progress = currentPoints / 10000;
    } else if (currentPoints > 1000) {
      currentTier = "Gold";
      nextTier = "Platinum";
      nextTierPoints = 10000 - currentPoints;
      progress = currentPoints / 10000;
    } else {
      currentTier = "Silver";
      nextTier = "Gold";
      nextTierPoints = 1000 - currentPoints;
      progress = currentPoints / 1000;
    }

    setCurrentTier(currentTier);
    setNextTier(nextTier);
    setNextTierPoints(nextTierPoints);
    setProgress(`${progress * 100}%`);
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
              <div className="mask mask-squircle h-12 w-12 bg-white">
                <img src={profilePicture ? profilePicture : logo} alt="DP" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <p>
              {userName && userName}{" "}
              {formatWalletAddress(userData && walletAddress)}
            </p>
            <p>
              {currentTier} tier : {points} points
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
            <h3 className="text-lg font-bold">Earning Points:</h3>
            <p className="py-4">Earn points by doing x x x </p>
          </div>
        </dialog>
      </header>
      <div className="h-4 w-full rounded-full bg-gray-600">
        <div
          className="h-full rounded-full bg-green-500"
          style={{ width: `${progress}` }}
        ></div>
      </div>
      <p>
        Earn {nextTierPoints} more points to {nextTier} tier
      </p>
    </div>
  );
};

export default ProgressBar;
