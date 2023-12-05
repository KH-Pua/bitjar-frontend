//-----------Libraries-----------//
import axios from "axios";
import React, { useState, useEffect } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const TransactionHistoryTable = ({ userId }) => {
  useEffect(() => {
    if (userId) {
      console.log("use effect userId: ", userId);
      axios
        .post(`${BACKEND_URL}/users/getUserPastTransactions`, {
          userId: userId,
        }) //
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>label1</th>
            <th>label2</th>
            <th></th>
          </tr>
        </thead>
        {/* body */}
        {
          userId && null
          // data.map((row) => (
          //   <tbody key={row.id}>
          //     <tr>
          //       <td>
          //         <div className="flex items-center gap-3">
          //           <div className="avatar">
          //             <div className="mask mask-squircle h-12 w-12">
          //               <img
          //                 src={row.profilePicture}
          //                 alt="Avatar Tailwind CSS Component"
          //               />
          //             </div>
          //           </div>
          //         </div>
          //       </td>
          //       <td>
          //         {row.userName}
          //         <br />
          //       </td>
          //       <td>{row.points}</td>
          //     </tr>
          //   </tbody>
          // ))
        }
      </table>
    </div>
  );
};
