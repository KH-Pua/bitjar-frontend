//-----------Libraries-----------//
import React, { useState, useEffect } from "react";

//-----------Utilities-----------//
import { apiRequest } from "../../utilities/apiRequests";

//-----------Media-----------//
import { LinkIcon } from "@heroicons/react/24/outline";

export const TransactionHistoryTable = ({ account }) => {
  const [userTransactionHistory, setUserTransactionHistory] = useState(null);

  useEffect(() => {
    if (account) {
      apiRequest
        .get(`/transactions/products/${account}`)
        .then((response) => {
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
            {account && userTransactionHistory ? (
              userTransactionHistory.length > 0 ? (
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
                        rel="noreferrer"
                      >
                        <LinkIcon className="h-6 w-6 text-gray-500" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-4 text-center text-base font-medium text-gray-900"
                  >
                    {userTransactionHistory === null
                      ? "Loading..."
                      : "No Transactions available"}
                  </td>
                </tr>
              )
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
};
