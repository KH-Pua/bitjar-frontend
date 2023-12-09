const TierTable = ({ data }) => {
  return (
    <div className=" w-full overflow-y-auto rounded-lg  px-2 pb-2">
      <table className="table">
        {/* head */}
        <thead className="">
          <tr className="text-center">
            <th>Airdrop Tier</th>
            <th>Points Needed</th>
            <th>Points Multiplier</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td>Silver</td>
            <td>0</td>
            <td>1.0x</td>
          </tr>
          <tr>
            <td>Gold</td>
            <td>1,000</td>
            <td>1.5x</td>
          </tr>
          <tr>
            <td>Platinum</td>
            <td>10,000</td>
            <td>2.0x</td>
          </tr>
          <tr>
            <td>Diamond 💎</td>
            <td>100,000</td>
            <td>3.0x</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TierTable;
