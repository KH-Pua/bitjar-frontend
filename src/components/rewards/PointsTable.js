import { formatWalletAddress } from "../../utilities/formatting";
import logo from "../../media/bitjar-logo.png";

import { useState } from "react";

const PointsTable = ({ data }) => {
  const [windowHeight, setWindowHeight] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);

  // console.log(`window size ${window.matchMedia("(max-width: 700px)").matches}`);

  function reportWindowSize() {
    let heightOutput = window.innerHeight;
    let widthOutput = window.innerWidth;

    setWindowHeight(heightOutput);
    setWindowWidth(widthOutput);
  }

  window.onresize = reportWindowSize;

  return (
    <div className="overflow-y-auto bg-white px-[1em]">
      {/* <table className="table"> */}
      <table className="text-left">
        {/* head */}
        <thead className="sticky top-0 z-10 mb-[1em] bg-slate-50">
          <tr>
            <th className="table-header lg:w-[25%]"></th>
            <th className="table-header pr-[3em]">Username</th>
            {windowWidth <= 1024 ? null : (
              <th className="table-header  pr-[5em]">Wallet</th>
            )}
            <th className="table-header  pl-[1em] pr-[3em]">Points</th>
          </tr>
        </thead>

        {/* body */}
        {data &&
          data.map((row) => (
            // Not sure why I can't put border-b-[1px]
            <tbody key={row.id} className="border-b-[1px] border-slate-300">
              <tr>
                <td>
                  <div className="avatar">
                    <div className="mask mask-circle my-[1em] mr-[1em] h-12 w-12 bg-white">
                      <img
                        src={row.profilePicture ? row.profilePicture : logo}
                        alt="DP"
                      />
                    </div>
                  </div>
                </td>

                <td className="font-semibold text-slate-800">
                  {row.userName ? row.userName : "-"}
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
  );
};

export default PointsTable;
