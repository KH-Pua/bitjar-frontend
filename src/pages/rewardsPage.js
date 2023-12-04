//-----------Libraries-----------//
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";

//-----------Components-----------//
import ProgressBar from "../components/rewards/ProgressBar.js";
import PointsTable from "../components/rewards/PointsTable.js";
import ReferralTable from "../components/rewards/ReferralTable.js";

export default function RewardsPage() {
  // Variables
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [pointsLeaderboard, setPointsLeaderboard] = useState();

  // GET - Retrieve points data from backend
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/users/all`) //
      .then((response) => {
        console.log(response.data.data);
        setPointsLeaderboard(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className=" flex flex-col">
      <h1 className="p-0 text-3xl font-bold text-black">Rewards</h1>
      <div className="w-full rounded-lg  bg-slate-200 p-2">
        <ProgressBar progress="40%" currentPoints="1000" nextTier="400" />
      </div>
      <main className="grid grid-cols-2 gap-2">
        <figure>
          <h2>Points leaderboard</h2>
          <PointsTable
            label1="Username"
            label2="Points"
            data={pointsLeaderboard}
          />
        </figure>
        <figure>
          <h2>Referral leaderboard</h2>
          <ReferralTable
            label1="Username"
            label2="Referrals"
            data={pointsLeaderboard}
          />
        </figure>
        <figure>Points history</figure>
        <figure>Referral history</figure>
      </main>
    </div>
  );
}
