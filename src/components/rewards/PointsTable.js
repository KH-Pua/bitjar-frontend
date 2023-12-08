//-----------Libraries-----------//
import axios from "axios";
import { useState } from "react";

//-----------Components-----------//
import { RefererOutput } from "./RefererOutput";

//-----------Utilities-----------//
import { formatWalletAddress } from "../../utilities/formatting";

//-----------Media-----------//
import logo from "../../media/bitjar-logo.png";
import { RankingOutput } from "./RankingOutput";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PointsTable = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(null);
  const [userRefererList, setUserRefererList] = useState(null); // also dead code

  const reportWindowSize = () => {
    let widthOutput = window.innerWidth;
    setWindowWidth(widthOutput);
  };
  window.addEventListener("resize", reportWindowSize);

  // Dead code, but leaving it here to talk about during the code review, as to why this code is not feasible
  const getUserReferer = async (address) => {
    let referer = await axios.post(`${BACKEND_URL}/users/getUserRefererIfAny`, {
      walletAddress: address,
    });

    setUserRefererList((prevState) => {
      return { ...prevState, [address]: referer.output };
    });
  };

  return (
    <>
      <div className="overflow-y-auto bg-white pr-[.5em]">
        <table className="text-left">
          {/* head */}
          <thead className="sticky top-0 z-10 mb-[1em] bg-slate-50">
            <tr>
              <th className="table-header lg:w-[25%]"></th>
              <th className="table-header pr-[3em]">Username</th>
              {windowWidth <= 1024 ? null : (
                <th className="table-header pr-[5em]">Wallet</th>
              )}
              <th className="table-header pl-[1em] pr-[2.5em]">Points</th>
            </tr>
          </thead>

          {/* body */}
          {data &&
            data.map((row, index) => (
              <tbody key={row.id} className="border-b-[1px] border-slate-300">
                <tr>
                  <td>
                    <div className="relative">
                      {index === 0 || index === 1 || index === 2 ? (
                        <RankingOutput index={index + 1} />
                      ) : null}
                      <div className="avatar">
                        <div className="mask mask-circle my-[1em] mr-[1em] h-[4rem] w-[4rem] bg-white">
                          <img
                            src={row.profilePicture ? row.profilePicture : logo}
                            alt="DP"
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* This part is pretty interesting, will talk about it during code review */}
                  <td>
                    {row.userName ? (
                      <div className="flex flex-col gap-0">
                        <div className="font-semibold text-slate-900">
                          {row.userName}
                        </div>
                        <RefererOutput walletaddress={row.walletAddress} />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0">
                        <div className="font-semibold text-slate-800">-</div>
                        <RefererOutput walletaddress={row.walletAddress} />
                      </div>
                    )}
                  </td>
                  {windowWidth <= 1024 ? null : (
                    <td>{formatWalletAddress(row.walletAddress)}</td>
                  )}
                  <td className="pl-[1em] font-semibold">{row.points}</td>
                </tr>
              </tbody>
            ))}
        </table>
      </div>
    </>
  );
};

export default PointsTable;
