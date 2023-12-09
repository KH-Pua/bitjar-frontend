// Import Libraries
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

// Import Utilities
import { formatWalletAddress } from "../../utilities/formatting";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const RefererOutput = ({ walletaddress }) => {
  const [refererName, setRefererName] = useState(null);

  useEffect(() => {
    if (walletaddress) {
      getReferer(walletaddress);
    }
  }, []);

  const getReferer = async (address) => {
    let output = await axios.post(`${BACKEND_URL}/users/getUserRefererIfAny`, {
      walletAddress: address,
    });

    // If No Referer
    if (Array.isArray(output.data.output)) {
      setRefererName("xx");
    } else {
      // If Unnamed User, Put Wallet Address
      if (output.data.output.userName == "") {
        setRefererName(formatWalletAddress(output.data.output.walletAddress));
      } else {
        setRefererName(output.data.output.userName);
      }
    }
  };

  return (
    <>
      {refererName && refererName != "xx" ? (
        <div className="text-[.7rem] font-medium text-slate-500">
          Invited By:
          <div className=" inline text-[.8rem] font-semibold text-slate-600">
            <p className="-mt-1">{refererName && refererName}</p>
          </div>
        </div>
      ) : null}
    </>
  );
};
