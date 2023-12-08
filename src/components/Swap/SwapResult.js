import React, { useState, useEffect } from "react";

export const SwapResult = ({ toAmount, fromAmount, fromCoin, toCoin }) => {
  // const [originalFromCoin, setOriginalFromCoin] = useState(null);
  // const [originalToCoin, setOriginalToCoin] = useState(null);

  // useEffect(() => {
  //   setOriginalFromCoin(fromCoin);
  //   setOriginalToCoin(toCoin);
  // }, []);

  // useEffect(() => {
  //   if (toCoin || fromCoin) {
  //     setOriginalFromCoin(fromCoin);
  //     setOriginalToCoin(toCoin);
  //   }
  // }, [originalFromCoin, originalToCoin]);

  return (
    <>
      {/* <button
        onClick={() => {
          console.log(originalFromCoin);
        }}
      >
        Hoho
      </button> */}
      {/* {originalFromCoin && originalFromCoin.Symbol == fromCoin.Symbol ? ( */}
      <>
        {toAmount == "Fetching Price..." || toAmount == "" ? null : (
          <p className="text-[1.5rem] font-medium">
            {fromAmount}{" "}
            <span className="text-[1.2rem] text-slate-700">
              {fromCoin ? fromCoin.symbol : null}
            </span>{" "}
            = {toAmount}{" "}
            <span className="text-[1.2rem] text-slate-700">
              {toCoin ? toCoin.symbol : null}
            </span>
          </p>
        )}
        {/* Just to display Fetching Price */}
        {toAmount == "Fetching Price..." ? (
          <p className="animate-pulse text-[1.5rem] font-medium">{toAmount}</p>
        ) : null}
      </>
      {/* ) : null} */}
    </>
  );
};
