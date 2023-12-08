import { formatTimestamp } from "../../utilities/formatting";
import { useState } from "react";

const PointsHistoryTable = ({ data }) => {
  const [windowWidth, setWindowWidth] = useState(null);

  const reportWindowSize = () => {
    let widthOutput = window.innerWidth;
    setWindowWidth(widthOutput);
  };
  window.addEventListener("resize", reportWindowSize);

  return (
    <div className="overflow-y-auto bg-white px-[.5em]">
      <table className="text-left">
        {/* head */}
        <thead className="sticky top-0 z-10 mb-[1em] bg-slate-50">
          <tr>
            <th className="table-header pl-[2em] pr-[2em] lg:w-[25%]">
              Timestamp
            </th>
            <th className="table-header pl-[1em]">Activity</th>
            <th className="table-header pl-[1em] pr-[2em]">Points</th>
          </tr>
        </thead>
        {/* body */}
        {data &&
          data.map((row) => (
            <tbody key={row.id} className="border-b-[1px] border-slate-300">
              <tr>
                <td className="py-[1em] pl-[2em]">
                  {formatTimestamp(row.createdAt)}
                </td>
                <td className="pl-[1em]">
                  {row.actionName}
                  <br />
                </td>
                <td className="pr-[.7em] text-center font-semibold">
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
