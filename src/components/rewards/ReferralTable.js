import { formatWalletAddress } from "../../utilities/formatting";
//-----------Media-----------//
import logo from "../../media/bitjar-logo.png";

import { useState } from "react";

const ReferralTable = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(null);

  function reportWindowSize() {
    let widthOutput = window.innerWidth;
    setWindowWidth(widthOutput);
  }

  window.addEventListener("resize", reportWindowSize);

  return (
    <div className="overflow-y-auto bg-white px-[1em]">
      <table className="text-left">
        {/* head */}
        <thead className="sticky top-0 z-10 mb-[1em] bg-slate-50">
          <tr>
            <th className="table-header lg:w-[25%]"></th>
            <th className="table-header pr-[3em]">Username</th>
            {windowWidth <= 1024 ? null : (
              <th className="table-header pr-[5em]">Wallet</th>
            )}
            <th className="table-header pr-[2em]">Referrals</th>
          </tr>
        </thead>
        {/* body */}
        {data &&
          data.map((row) => (
            <tbody key={row.id} className="border-b-[1px] border-slate-300">
              <tr>
                <td>
                  <div className="avatar">
                    <div className="mask mask-circle my-[1em] mr-[1em] h-[4em] w-[4em] bg-white">
                      <img
                        src={row.profilePicture ? row.profilePicture : logo}
                        alt="DP"
                      />
                    </div>
                  </div>
                </td>

                <td className="font-semibold text-slate-900">
                  {row.userName ? row.userName : "-"}
                </td>
                {windowWidth <= 1024 ? null : (
                  <td>{formatWalletAddress(row.walletAddress)}</td>
                )}
                <td className="pl-[2em] font-semibold">{row.referralCount}</td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default ReferralTable;
