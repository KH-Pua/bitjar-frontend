//-----------Utilities-----------//
import { formatTimestamp } from "../../utilities/formatting";
import { formatWalletAddress } from "../../utilities/formatting";

// Import Libraries
import { useState } from "react";

const ReferralHistoryTable = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(null);

  const reportWindowSize = () => {
    let widthOutput = window.innerWidth;
    setWindowWidth(widthOutput);
  };
  window.addEventListener("resize", reportWindowSize);

  return (
    <div className="overflow-y-auto bg-white pr-[.5em]">
      <table className="text-left">
        {/* head */}
        <thead className="sticky top-0 z-10 mb-[1em] bg-slate-50">
          <tr>
            <th className="table-header pl-[1em] pr-[2em] lg:w-[25%]">
              Timestamp
            </th>
            <th className="table-header pl-[1em]">Username</th>
            {windowWidth <= 1024 ? null : (
              <th className="table-header pl-[1em] pr-[2em]">Wallet Address</th>
            )}
          </tr>
        </thead>
        {/* body */}
        {data &&
          data.map((row) => (
            <tbody key={row.id} className="border-b-[1px] border-slate-300">
              <tr>
                <td className="py-[1em] pl-[1em] text-slate-600">
                  {formatTimestamp(row.referee.createdAt)}
                </td>
                <td className="pl-[1em] font-medium">
                  {row.referee.userName ? row.referee.userName : "-"}
                  <br />
                </td>
                {windowWidth <= 1024 ? null : (
                  <td className="pr-[.7em] text-center">
                    {formatWalletAddress(row.referee.walletAddress)}
                  </td>
                )}
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default ReferralHistoryTable;
