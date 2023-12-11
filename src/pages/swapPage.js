//-----------Libraries-----------//
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Web3 from "web3";
import qs from "qs";

//-----------Components-----------//
import SwapFrom from "../components/Swap/SwapFrom";
import SwapTo from "../components/Swap/SwapTo";

//-----------Utilties-----------//
import { formatWalletAddress } from "../utilities/formatting";
import { SwapResult } from "../components/Swap/SwapResult";

export default function SwapPage() {
  const [tokens, setTokens] = useState([]);
  const [currentTrade, setCurrentTrade] = useState({ from: null, to: null });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [swapQuote, setSwapQuote] = useState(null);

  // Pass in as Props to Swap Components in order to set state in Parent component
  const [fromCoin, setFromCoin] = useState(null);
  const [toCoin, setToCoin] = useState(null);

  // Constants
  const API_KEY = process.env.REACT_APP_0X_KEY;
  const address = useOutletContext();

  // Headers for 0x API requests
  const headers = {
    headers: {
      "0x-api-key": API_KEY,
    },
  };

  // Fetch token list on component mount
  useEffect(() => {
    const listAvailableTokens = async () => {
      const response = await axios.get(
        "https://tokens.coingecko.com/uniswap/all.json",
      );

      // Filter tokens by specific symbols (BTC, ETH, USDC)
      const filteredTokens = response.data.tokens.filter(
        (token) =>
          ["WBTC", "WETH", "USDC", "DAI", "USDT"].includes(token.symbol),
        // ["WBTC", "WETH", "USDC", "ETH20", "DAI", "USDT"].includes(token.symbol),
      );

      setTokens(filteredTokens);
    };
    listAvailableTokens();
  }, []);

  // Set current trade
  const selectToken = (token, side) => {
    const updatedTrade = { ...currentTrade, [side]: token };
    setCurrentTrade(updatedTrade);
  };

  const fetchPrice = async () => {
    if (!currentTrade.from || !currentTrade.to || !fromAmount) return;

    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: fromAmount * 10 ** currentTrade.from.decimals,
      takerAddress: address,
    };
    setToAmount("Fetching Price...");
    console.log("fetchpriceParams", params);

    try {
      const priceResponse = await axios.get(
        `https://api.0x.org/swap/v1/price?${new URLSearchParams(params)}`,
        headers,
      );

      console.log("Price Response", priceResponse);
      const convertedAmount =
        priceResponse.data.buyAmount / 10 ** currentTrade.to.decimals;
      setToAmount(convertedAmount);
    } catch (error) {
      console.error("Error fetching price or quote", error);
      setToAmount("Error fetching price, try again");
    }
  };

  // Fetch a firm quote - commitment to fill the market order
  const fetchQuote = async () => {
    if (!currentTrade.from || !currentTrade.to || !fromAmount) return;

    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: fromAmount * 10 ** currentTrade.from.decimals,
      takerAddress: address,
    };

    const endquery = new URLSearchParams(params);
    console.log("yooo ", endquery.toString());
    // console.log("hmmm?", qs.stringify(params));

    try {
      // const quoteResponse = await axios.get(
      //   `https://api.0x.org/swap/v1/quote?${endquery.toString()}`,
      //   {
      //     headers: {
      //       "0x-api-key": API_KEY,
      //     },
      //   },
      // );

      let quoteResponse = await fetch(
        `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
        {
          headers: {
            "0x-api-key": API_KEY,
          },
        },
      );

      let swapQuoteJSON = await quoteResponse.json();
      console.log(swapQuoteJSON);

      setSwapQuote(quoteResponse.data);
      console.log("FetchQuote", swapQuote);
    } catch (err) {
      console.log(err.response);
      if (err.response.data.code == 111) {
        console.log(`error code is 111, gas estimation failed`);
      }
    }
  };

  // Execute swap
  const executeSwap = async () => {
    if (!swapQuote || !address) {
      console.log("failed");
      return;
    }

    // Use the existing provider from the MetaMask connection
    const web3 = new Web3(window.ethereum);

    // https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#eth-sendtransaction
    try {
      await web3.eth.sendTransaction({
        from: address,
        // to: swapQuote.to, // OPTIONAL
        // data: swapQuote.data, // OPTIONAL
        // value: swapQuote.value,  // OPTIONAL
        // gasPrice: swapQuote.gasPrice,// OPTIONAL
      });
    } catch (error) {
      console.error("Error executing swap", error);
    }

    // try {
    //   await web3.eth.sendTransaction({
    //     from: address,
    //     to: swapQuote.to,
    //     data: swapQuote.data,
    //     value: swapQuote.value,
    //     gasPrice: swapQuote.gasPrice,
    //   });
    // } catch (error) {
    //   console.error("Error executing swap", error);
    // }
  };

  // Render tokens list
  const renderTokenList = () => {
    return tokens.map((token, index) => (
      <div key={index} onClick={() => selectToken(token, "from")}>
        {token.symbol}
      </div>
    ));
  };

  return (
    <>
      <div className="flex w-full flex-row ">
        <h1 className="text-2xl font-bold">Swap</h1>
        <div className="flex w-full flex-col items-center justify-center gap-[.5em]  px-3">
          <p className="translate-y-3">
            {" "}
            Crypto swaps powered by
            <a
              href="https://www.moonpay.com/"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-purple-800"
            >
              {" "}
              0x
            </a>
          </p>
          <p className="mt-4">
            Connected:
            <span className="font-semibold">
              {formatWalletAddress(address)}
            </span>
          </p>
          {/* Swap Form */}
          <main className="">
            <div className="mt-3 pb-[1em]">
              <h2 className="text-lg font-semibold">Swap from:</h2>
              <SwapFrom
                tokens={tokens && tokens}
                selectToken={selectToken}
                fromAmount={fromAmount}
                setFromAmount={setFromAmount}
                setFromCoin={setFromCoin}
              />
            </div>
            <div className="pb-[2em]">
              <h2 className="text-lg font-semibold">Swap to:</h2>
              <SwapTo
                tokens={tokens && tokens}
                selectToken={selectToken}
                setToCoin={setToCoin}
              />
            </div>
            <div className="mt-3">
              <p className="text-[1rem] font-medium text-slate-600">
                Estimated Price:
              </p>
              <SwapResult
                fromAmount={fromAmount}
                toAmount={toAmount}
                fromCoin={fromCoin}
                toCoin={toCoin}
              />
            </div>
          </main>
          <div className="mt-6 flex flex-row gap-3">
            <button
              onClick={fetchPrice}
              className="mr-4 rounded bg-blue-500 px-4 py-2 font-bold leading-tight text-white hover:bg-blue-700"
            >
              Fetch Price
            </button>

            <button
              onClick={fetchQuote}
              className="mr-4 rounded bg-blue-500 px-4 py-2 font-bold leading-tight text-white hover:bg-blue-700"
            >
              Fetch Quote
            </button>
            {/* Table to display the quote data */}
            {swapQuote && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Swap Quote:</h2>
                <table className="min-w-full table-fixed">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Field</th>
                      <th className="px-4 py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(swapQuote).map(([key, value]) => (
                      <tr key={key}>
                        <td className="border px-4 py-2">{key}</td>
                        <td className="border px-4 py-2">{value.toString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Execute Swap */}
            <button
              onClick={executeSwap}
              className="rounded bg-green-400 px-4 py-2 font-bold leading-tight text-black hover:bg-green-500"
            >
              Execute Swap
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
