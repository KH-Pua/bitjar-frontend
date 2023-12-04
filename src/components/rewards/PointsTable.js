const PointsTable = ({ label1, label2, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>{label1}</th>
            <th>{label2}</th>
            <th></th>
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
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={row.profilePicture}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {row.userName}
                  <br />
                </td>
                <td>{row.points}</td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default PointsTable;
