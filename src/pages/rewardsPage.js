//-----------Libraries-----------//
import { useState, useEffect } from "react";

//-----------Components-----------//
import ProgressBar from "../components/rewards/ProgressBar.js";
import PointsTable from "../components/rewards/PointsTable.js";
import ReferralTable from "../components/rewards/ReferralTable.js";
import PointsHistoryTable from "../components/rewards/PointsHistoryTable.js";
import ReferralHistoryTable from "../components/rewards/ReferralHistoryTable.js";

//-----------Utlities-----------//
import { apiRequest, getUserData } from "../utilities/apiRequests";
import DailyRewardsButton from "../components/rewards/DailyRewardsButton.js";

export default function RewardsPage() {
  //-----------HARDCODED DATA (TO UPDATE)-----------//
  const address = localStorage.getItem("connection_meta");

  // Variables
  const [isClaimed, setIsClaimed] = useState(false);

  // Data
  const [pointsLeaderboard, setPointsLeaderboard] = useState();
  const [referralLeaderboard, setReferralLeaderboard] = useState();
  const [pointsData, setPointsData] = useState();
  const [referralData, setReferralData] = useState();
  const [user, setUser] = useState("");

  const fetchPointsRanking = async () => {
    try {
      const response = await apiRequest.get("/users/points/ranking");
      setPointsLeaderboard(response.data.output);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReferralRanking = async () => {
    try {
      const response = await apiRequest.get("/users/referrals/ranking");
      setReferralLeaderboard(response.data.output);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPointsHistory = async () => {
    try {
      const response = await apiRequest.get(
        `/users/transactions/points/${user.id}`,
      );
      setPointsData(response.data.output);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchReferralHistory = async () => {
    try {
      const response = await apiRequest.get(`/users/referrals/${user.id}`);
      setReferralData(response.data.output);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserData = async () => {
    try {
      const user = await getUserData(address);
      setUser(user);
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // GET - Retrieve all data
  useEffect(() => {
    if (user) {
      fetchPointsRanking();
      fetchReferralRanking();
      fetchPointsHistory();
      fetchReferralHistory();
    }
  }, [user]);

  return (
    <div className=" flex w-full flex-col items-center">
      <header className="flex w-full flex-row justify-between">
        <h1 className="p-0 text-3xl font-bold text-black">Rewards</h1>
        <DailyRewardsButton
          user={user}
          fetchPointsHistory={fetchPointsHistory}
          fetchUserData={fetchUserData}
        />
      </header>
      {/* Points progress bar */}
      <div className="my-2 w-full rounded-lg bg-slate-200 p-2">
        <ProgressBar userData={user && user} />
      </div>
      <main className="mt-3 grid w-full grid-cols-1 gap-2 xl:grid-cols-2">
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
