export const SwapResult = ({ toAmount, fromAmount, fromCoin, toCoin }) => {
  return (
    <>
      <>
        {toAmount === "Fetching Price..." || toAmount === "" ? null : (
          <p className="text-[1.2rem] font-medium">
            {fromAmount}{" "}
            <span className="text-[1.2rem] text-slate-700">
              {fromCoin ? fromCoin.symbol : null}
            </span>{" "}
            = {toAmount.toFixed(6)}{" "}
            <span className="text-[1.2rem] text-slate-700">
              {toCoin ? toCoin.symbol : null}
            </span>
          </p>
        )}
        {/* Just to display Fetching Price */}
        {toAmount === "Fetching Price..." ? (
          <p className="animate-pulse text-[1.2rem] font-medium">{toAmount}</p>
        ) : null}
      </>
    </>
  );
};
