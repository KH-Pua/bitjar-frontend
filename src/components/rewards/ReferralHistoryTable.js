//-----------Utilities-----------//
import { formatTimestamp } from "../../utilities/formatting";
import { formatWalletAddress } from "../../utilities/formatting";

const ReferralHistoryTable = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg bg-slate-200 px-2 pb-2 shadow-lg">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Username</th>
            <th>Wallet Address</th>
          </tr>
        </thead>
        {/* body */}
        {data &&
          data.map((row) => (
            <tbody key={row.id}>
              <tr>
                <td>{formatTimestamp(row.referee.createdAt)}</td>
                <td>
                  {row.referee.userName ? row.referee.userName : "-"}
                  <br />
                </td>
                <td>{formatWalletAddress(row.referee.walletAddress)}</td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default ReferralHistoryTable;
