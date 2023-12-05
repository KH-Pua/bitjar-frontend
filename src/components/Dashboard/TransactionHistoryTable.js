//-----------Libraries-----------//
import axios from "axios";
import React, { useState, useEffect } from "react";

// Import Icons
import { LinkIcon } from "@heroicons/react/24/outline";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const TransactionHistoryTable = ({ userId }) => {
  const [userTransactionHistory, setUserTransactionHistory] = useState(null);

  useEffect(() => {
    if (userId) {
      console.log("use effect userId: ", userId);
      axios
        .post(`${BACKEND_URL}/users/getUserPastTransactions`, {
          userId: userId,
        }) //
        .then((response) => {
          console.log(response.data);
          setUserTransactionHistory(response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <button
        onClick={() => {
          console.log(userTransactionHistory);
        }}
      >
        Hey
      </button>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="">
              <th>COIN</th>
              <th>PRODUCT</th>
              <th>AMOUNT</th>
              <th></th>
            </tr>
          </thead>
          {/* body */}
          {userId &&
            userTransactionHistory &&
            userTransactionHistory.map((element) => (
              <tbody key={element.id}>
                <tr className="border-b-[1px] border-slate-300">
                  <td className="font-semibold">{element.coin.coinName}</td>
                  <td>{element.product.productName}</td>
                  <td>{element.amount}</td>
                  <td>
                    <a
                      // target="_blank"
                      href={`https://etherscan.io/tx/${element.transactionHash}`}
                    >
                      <LinkIcon className="h-6 w-6 text-gray-500" />
                    </a>
                  </td>
                </tr>
              </tbody>
            ))}
        </table>
      </div>
    </>
  );
};
