import { useEffect, useState } from "react";

const ProgressBar = ({ currentPoints }) => {
  const [progress, setProgress] = useState(0);
  const [currentTier, setCurrentTier] = useState("");
  const [nextTier, setNextTier] = useState("");
  const [nextTierPoints, setNextTierPoints] = useState(0);

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

  useEffect(() => {
    calculateProgress(currentPoints);
  }, [currentPoints]);

  return (
    <div>
      <header className="flex flex-row justify-between">
        <h1>
          {currentTier} : {currentPoints}
        </h1>
        <button
          className="animate-pulse text-xs hover:font-semibold"
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
        Earn {nextTierPoints} more points to {nextTier}
      </p>
    </div>
  );
};

export default ProgressBar;
