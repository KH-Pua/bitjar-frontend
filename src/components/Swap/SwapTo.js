import { useState, useEffect } from "react";

const SwapTo = ({ tokens, selectToken, setToCoin }) => {
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    if (coin) {
      setToCoin(coin);
    }
  }, [coin]);

  return (
    <div className="dropdown dropdown-bottom w-full md:w-[50%] lg:w-[30%]">
      <div
        tabIndex={0}
        role="button"
        className=" my-1 flex h-12 w-[100%] flex-row items-center rounded-md border-[1px] border-black  p-1 py-2 hover:bg-slate-200"
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
                onClick={(e) => {
                  setCoin(token);
                  selectToken(token, "to");
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
  );
};

export default SwapTo;
