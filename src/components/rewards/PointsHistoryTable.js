import { formatTimestamp } from "../../utilities/formatting";

const PointsHistoryTable = ({ data }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg bg-slate-200 px-2 pb-2 shadow-lg">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Activity</th>
            <th>Points</th>
          </tr>
        </thead>
        {/* body */}
        {data &&
          data.map((row) => (
            <tbody key={row.id}>
              <tr>
                <td>{formatTimestamp(row.createdAt)}</td>
                <td>
                  {row.actionName}
                  <br />
                </td>
                <td>{row.pointsAllocated}</td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default PointsHistoryTable;
