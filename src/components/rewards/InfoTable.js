const InfoTable = ({ data }) => {
  return (
    <div className=" w-full overflow-y-auto rounded-lg  px-2 pb-2">
      <table className="table">
        {/* head */}
        <thead className="">
          <tr className="text-center">
            <th>Action</th>
            <th>Points</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td>Sign up with Bitjar</td>
            <td>50</td>
            <td>Max (1) once per wallet</td>
          </tr>
          <tr>
            <td>Refer new user</td>
            <td>10</td>
            <td>Unlimited referrals</td>
          </tr>
          <tr>
            <td>Claim daily login points</td>
            <td>5</td>
            <td>Max (1) per day</td>
          </tr>
          <tr>
            <td>Purchase Crypto on Bitjar</td>
            <td>$10/pt</td>
            <td>Capped at 1000pts per day</td>
          </tr>
          <tr>
            <td>Deposit Crypto on Bitjar</td>
            <td>$10/pt</td>
            <td>Capped at 1000pts per day</td>
          </tr>
          <tr>
            <td>Referee purchases Crypto on Bitjar</td>
            <td>$100/pt</td>
            <td>Capped at 100 per day</td>
          </tr>
          <tr>
            <td>Referee purchases Crypto on Bitjar</td>
            <td>$100/pt</td>
            <td>Capped at 100 per day</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InfoTable;
