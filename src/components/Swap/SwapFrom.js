import { useState } from "react";

const SwapFrom = ({ tokens, selectToken, fromAmount, setFromAmount }) => {
  const [coin, setCoin] = useState("");

  const handleAmountChange = (e) => {
    setFromAmount(e.target.value);
  };

  return (
    <div className="flex flex-row items-center">
      <div className="dropdown dropdown-bottom">
        <div
          tabIndex={0}
          role="button"
          className=" my-1 flex h-12 w-[200px] flex-row items-center rounded-l-md border-[1px] border-black p-1 py-2 hover:bg-slate-200"
        >
          <div>
            {coin ? (
              <div className="flex flex-row gap-2">
                <img src={coin.logoURI} alt={coin.name} />
                {coin.symbol}
              </div>
            ) : (
              "Select Coin"
            )}
          </div>{" "}
          <span className="ml-auto mr-2">▽</span>
        </div>

        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
        >
          {tokens &&
            tokens.map((token, index) => (
              <li key={index}>
                <button
                  className="hover:bg-slate-200"
                  onClick={() => {
                    setCoin(token);
                    selectToken(token, "from");
                  }}
                >
                  <img src={token.logoURI} alt={token.name} />
                  {token.symbol}
                </button>{" "}
                {/* Assuming token.name or another property is used for the button label */}
              </li>
            ))}
        </ul>
      </div>
      <input
        type="text"
        placeholder="100"
        value={fromAmount}
        onChange={handleAmountChange}
        className="h-12 w-[150px] rounded-r-md border-[1px] border-black text-center"
      />
    </div>
  );
};

export default SwapFrom;
