// Import Libraries
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

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

    if (Array.isArray(output.data.output)) {
      setRefererName("xx");
    } else {
      if (output.data.output.userName == "") {
        setRefererName("an unnamed user");
      } else {
        setRefererName(output.data.output.userName);
      }
    }
  };

  return (
    <>
      {
        refererName && refererName != "xx" ? (
          <div className="text-[.7rem] font-medium text-slate-500">
            Invited By:
            <p className=" inline text-[.8rem] font-semibold text-slate-600">
              <div className="-mt-1">{refererName && refererName}</div>
            </p>
          </div>
        ) : null
        // <div className="text-[.7rem] font-medium text-slate-500">
        //   <p className="inline text-[.8rem] font-semibold text-slate-600">
        //     <div>
        //       <br />
        //       <br />
        //     </div>
        //   </p>
        // </div>
      }
    </>
  );
};
