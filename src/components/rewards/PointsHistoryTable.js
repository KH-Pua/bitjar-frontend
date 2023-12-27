import { formatTimestamp } from "../../utilities/formatting";

const PointsHistoryTable = ({ data }) => {
  return (
    <div className="overflow-y-auto bg-white pr-[.5em]">
      <table className="text-left">
        {/* head */}
        <thead className="sticky top-0 z-10 mb-[1em] bg-slate-50">
          <tr>
            <th className="table-header pl-[1em] pr-[2em] lg:w-[25%]">
              Timestamp
            </th>
            <th className="table-header pl-[1em]">Activity</th>
            <th className="table-header pl-[1em] pr-[1em]">Points</th>
          </tr>
        </thead>
        {/* body */}
        {data &&
          data.map((row) => (
            <tbody key={row.id} className="border-b-[1px] border-slate-300">
              <tr>
                <td className="pl-[2em] text-slate-600">
                  {formatTimestamp(row.createdAt)}
                </td>
                <td className="py-[1em] pl-[3em] font-medium">
                  {row.actionName}
                  <br />
                </td>
                <td className="pl-[2em] text-center font-semibold">
                  {row.pointsAllocated}
                </td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default PointsHistoryTable;
