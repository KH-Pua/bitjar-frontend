//-----------Libraries-----------//
import { useState, useEffect } from "react";

//-----------Components-----------//
import ProgressBar from "../components/rewards/ProgressBar.js";
import PointsTable from "../components/rewards/PointsTable.js";
import ReferralTable from "../components/rewards/ReferralTable.js";
import PointsHistoryTable from "../components/rewards/PointsHistoryTable.js";
import ReferralHistoryTable from "../components/rewards/ReferralHistoryTable.js";

//-----------Utlities-----------//
import { dailyLoginPoints } from "../utilities/pointsMessages.js";
import { apiRequest } from "../utilities/apiRequests";

export default function RewardsPage() {
  //-----------HARDCODED DATA (TO UPDATE)-----------//
  const userId = 2;
  const address = localStorage.getItem("connection_meta");

  // Variables
  const [isClaimed, setIsClaimed] = useState(false);

  // Data
  const [pointsLeaderboard, setPointsLeaderboard] = useState();
  const [referralLeaderboard, setReferralLeaderboard] = useState();
  const [pointsData, setPointsData] = useState();
  const [referralData, setReferralData] = useState();

  const fetchPointsRanking = async () => {
    try {
      const response = await apiRequest.get("/users/points/ranking");
      console.log("Points Ranking:", response.data.output);
      setPointsLeaderboard(response.data.output);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReferralRanking = async () => {
    try {
      const response = await apiRequest.get("/users/referrals/ranking");
      console.log("Referral Ranking:", response.data.output);
      setReferralLeaderboard(response.data.output);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPointsHistory = async () => {
    try {
      const response = await apiRequest.get(
        `/users/transactions/points/${userId}`,
      );
      console.log("Points History:", response.data.output);
      setPointsData(response.data.output);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReferralHistory = async () => {
    try {
      const response = await apiRequest.get(`/users/referrals/${userId}`);
      console.log("Referral History:", response.data.output);
      setReferralData(response.data.output);
    } catch (err) {
      console.log(err);
    }
  };

  // GET - Retrieve all data
  useEffect(() => {
    fetchPointsRanking();
    fetchReferralRanking();
    fetchPointsHistory();
    fetchReferralHistory();
  }, []);

  const collectDailySignInPoints = async () => {
    try {
      const response = await apiRequest.post(
        `/users/transactions/points/add/${userId}`,
        dailyLoginPoints(),
      );
      fetchPointsHistory();
      setIsClaimed(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" flex w-full flex-col">
      <header className="flex flex-row justify-between">
        <h1 className="p-0 text-3xl font-bold text-black">Rewards</h1>
        <button
          className="btn "
          onClick={collectDailySignInPoints}
          disabled={isClaimed}
        >
          Claim Daily Login Points {address}
        </button>
      </header>
      {/* Points progress bar */}
      <div className="w-full rounded-lg bg-slate-200 p-2">
        <ProgressBar progress="40%" currentPoints="1000" nextTier="400" />
      </div>
      <main className="mt-3 grid grid-cols-1 gap-2 xl:grid-cols-2">
        <figure className="flex h-[500px] flex-col items-center">
          <h2 className="font-semibold">Points Leaderboard 🍯</h2>
          <PointsTable data={pointsLeaderboard} />
        </figure>
        <figure className="flex h-[500px] flex-col items-center">
          <h2 className="font-semibold">Referral Leaderboard 🥳</h2>
          <ReferralTable data={referralLeaderboard} />
        </figure>
        <figure className="flex h-[500px] flex-col items-center">
          <h2 className="font-semibold">Points History</h2>
          <PointsHistoryTable data={pointsData} />
        </figure>
        <figure className="flex h-[500px] flex-col items-center">
          <h2 className="font-semibold">Referral History</h2>
          <ReferralHistoryTable data={referralData} />
        </figure>
      </main>
    </div>
  );
}
