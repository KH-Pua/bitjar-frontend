//-----------Libraries-----------//
import { useEffect, useState } from "react";

//-----------Components-----------//
import PointNotification from "../details/PointNotification.js";

//-----------Utilities-----------//
import { apiRequest } from "../../utilities/apiRequests";
import { dailyLoginPoints } from "../../utilities/pointsMessages.js";
import { formatTimeToClaim } from "../../utilities/formatting.js";

const DailyRewardsButton = ({ user, fetchPointsHistory, fetchUserData }) => {
  const [isClaimed, setIsClaimed] = useState(false);
  const [timeToClaim, setTimeToClaim] = useState(null);
  const [renderNotification, setRenderNotification] = useState(false);

  const [windowHeight, setWindowHeight] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);

  function reportWindowSize() {
    let heightOutput = window.innerHeight;
    let widthOutput = window.innerWidth;

    setWindowHeight(heightOutput);
    setWindowWidth(widthOutput);
  }

  window.onresize = reportWindowSize;

  // Check against db for rewards claim
  useEffect(() => {
    const fetchData = async () => {
      if (user.id) {
        try {
          const checkClaimed = await apiRequest.get(
            `/transactions/points/dailyCheck/${user.id}`,
          );
          console.error("Points already claimed:", checkClaimed.data.result);
          setIsClaimed(true);
        } catch (error) {
          console.log("Points not claimed");
        }
      }
    };

    fetchData();
  }, [user.id]);

  const collectDailySignInPoints = async () => {
    try {
      const response = await apiRequest.post(
        `/transactions/points/add/`,
        dailyLoginPoints(user.walletAddress),
      );
      console.log("Daily rewards points collected");
      fetchPointsHistory();
      fetchUserData();
      setIsClaimed(true);
      setRenderNotification(true);
    } catch (err) {
      console.log(err);
    }
  };
  // Countdown timer to next cliam
  useEffect(() => {
    if (isClaimed) {
      const currentDate = new Date();

      // Set the current date to start of the next day (next day at 00:00:00)
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);

      const timeDifference = nextDay.getTime() - currentDate.getTime();
      setTimeToClaim(timeDifference);

      const interval = setInterval(() => {
        setTimeToClaim(timeToClaim - 1000);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isClaimed, timeToClaim]);

  return (
    <>
      <button
        className="rounded-lg bg-yellow-300 px-[.5em] font-medium transition-all hover:translate-y-[-2px] hover:bg-yellow-400 lg:px-[1em]"
        onClick={collectDailySignInPoints}
        disabled={isClaimed}
      >
        {isClaimed
          ? `${
              windowWidth <= 1024
                ? `${formatTimeToClaim(timeToClaim)}`
                : `Claim In ${formatTimeToClaim(timeToClaim)}`
            }`
          : "📆 Claim Daily Login!"}
      </button>
      {renderNotification && <PointNotification data={dailyLoginPoints()} />}
    </>
  );
};

export default DailyRewardsButton;
