//-----------Libraries-----------//
import axios from "axios";
import React, { useState, useEffect } from "react";

import { formatApyToPercent } from "../../utilities/formatting";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const HoldingsTable = ({ account }) => {
  const [holdings, setHoldings] = useState(null);

  useEffect(() => {
    if (account) {
      axios
        .get(`${BACKEND_URL}/users/holdings/${account}`) //
        .then((response) => {
          setHoldings(response.data.output);
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
                APY%
              </th>
            </tr>
          </thead>
          {/* body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {account && holdings ? (
              holdings.map((element) => (
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
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {formatApyToPercent(element.product.apr)}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="col-span-4 px-3 py-3 text-base font-medium text-gray-900">
                  No HODLings available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
