import { formatWalletAddress } from "../../utilities/formatting";
import logo from "../../media/bitjar-logo.png";

const PointsTable = ({ data }) => {
  return (
    <div className=" w-full overflow-y-auto rounded-lg bg-slate-200 px-2 pb-2 shadow-lg">
      <table className="table">
        {/* head */}
        <thead className="">
          <tr>
            <th></th>
            <th>Username</th>
            <th>Wallet</th>
            <th>Points</th>
          </tr>
        </thead>
        {/* body */}
        {data &&
          data.map((row) => (
            <tbody key={row.id}>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12 bg-white">
                        <img
                          src={row.profilePicture ? row.profilePicture : logo}
                          alt="DP"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>{row.userName ? row.userName : "-"}</td>
                <td>{formatWalletAddress(row.walletAddress)}</td>
                <td>{row.points}</td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default PointsTable;
