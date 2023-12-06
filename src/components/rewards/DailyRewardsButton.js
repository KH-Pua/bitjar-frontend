//-----------Libraries-----------//

import { useEffect, useState } from "react";

//-----------Utilities-----------//

import { apiRequest } from "../../utilities/apiRequests";
import { dailyLoginPoints } from "../../utilities/pointsMessages.js";

const DailyRewardsButton = ({ user, fetchPointsHistory, fetchUserData }) => {
  const [isClaimed, setIsClaimed] = useState(false);
  const [timeToClaim, setTimeToClaim] = useState(null);

  // useEffect to check points history for user if there is a daily points collected on today
  // if so -> set isClaimed to true

  // if not do nothing,

  const collectDailySignInPoints = async () => {
    try {
      const response = await apiRequest.post(
        `/transactions/points/add/${user.id}`,
        dailyLoginPoints(),
      );
      fetchPointsHistory();
      fetchUserData();
      setIsClaimed(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isClaimed) {
      const currentDate = new Date();

      // Set the current date to start of the next day (next day at 00:00:00)
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);

      const timeDifference = nextDay.getTime() - currentDate.getTime();
      setTimeToClaim(timeDifference);

      // Update time until next day every second
      const interval = setInterval(() => {
        setTimeToClaim(timeToClaim - 1000);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isClaimed, timeToClaim]);

  const formatTimeToClaim = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <button
      className="rounded-lg bg-yellow-200 px-2 shadow-lg hover:translate-y-[-2px] hover:bg-yellow-300"
      onClick={collectDailySignInPoints}
      disabled={isClaimed}
    >
      {isClaimed
        ? `Claim again in ${formatTimeToClaim(timeToClaim)}`
        : "📆 Claim Daily Login!"}
    </button>
  );
};

export default DailyRewardsButton;
