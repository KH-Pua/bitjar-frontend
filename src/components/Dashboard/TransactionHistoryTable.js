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
      <div className="-mx-2 mt-4 sm:-mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          {/* head */}
          <thead>
            <tr>
              <th className="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                Coin
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                Product
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                Amount
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                Txn Address
              </th>
            </tr>
          </thead>
          {/* body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {userId &&
              userTransactionHistory &&
              userTransactionHistory.map((element) => (
                <tr key={element.id}>
                  <td className="py-3 pl-4 text-sm font-medium text-gray-900">
                    {element.coin.coinName}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {element.product.productName}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {element.amount}
                  </td>
                  <td>
                    <a
                      href={`https://etherscan.io/tx/${element.transactionHash}`}
                      target="_blank"
                    >
                      <LinkIcon className="h-6 w-6 text-gray-500" />
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
