//-----------Libraries-----------//
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import Web3 from "web3";

//-----------Components-----------//
import SwapFrom from "../components/Swap/SwapFrom";
import SwapTo from "../components/Swap/SwapTo";

//-----------Utilties-----------//
import { formatWalletAddress } from "../utilities/formatting";

export default function SwapPage() {
  const [tokens, setTokens] = useState([]);
  const [currentTrade, setCurrentTrade] = useState({ from: null, to: null });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [swapQuote, setSwapQuote] = useState(null);

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
      const filteredTokens = response.data.tokens.filter((token) =>
        ["WBTC", "WETH", "USDC", "ETH20", "DAI", "USDT"].includes(token.symbol),
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
    setToAmount("fetching price...");
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

  // Automatically fetch price
  useEffect(() => {
    fetchPrice();
  }, [currentTrade, fromAmount]);

  // Fetch a firm quote - commitment to fill the market order
  const fetchQuote = async () => {
    if (!currentTrade.from || !currentTrade.to || !fromAmount) return;

    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: fromAmount * 10 ** currentTrade.from.decimals,
      takerAddress: address,
    };

    console.log(params);

    try {
      const quoteResponse = await axios.get(
        `https://api.0x.org/swap/v1/quote?${new URLSearchParams(params)}`,
        headers,
      );
      setSwapQuote(quoteResponse.data);
      console.log("FetchQuote", swapQuote);
    } catch (error) {
      console.error("Error fetching quote", error);
    }
  };

  // Execute swap
  const executeSwap = async () => {
    if (!swapQuote || !address) return;

    // Use the existing provider from the MetaMask connection
    const web3 = new Web3(window.ethereum);

    try {
      await web3.eth.sendTransaction({
        from: address,
        to: swapQuote.to,
        data: swapQuote.data,
        value: swapQuote.value,
        gasPrice: swapQuote.gasPrice,
      });
    } catch (error) {
      console.error("Error executing swap", error);
    }
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
    <div className="mt-12 w-max rounded-lg bg-white p-4 text-black shadow-md">
      <h1 className="text-2xl font-bold">Swap</h1>
      <p className="mt-4">
        Connected:
        <span className="font-semibold">{formatWalletAddress(address)}</span>
      </p>
      {/* Swap Form */}
      <main className="">
        <div className="mt-3">
          <h2 className="text-lg font-semibold">Swap from:</h2>
          <SwapFrom
            tokens={tokens && tokens}
            selectToken={selectToken}
            fromAmount={fromAmount}
            setFromAmount={setFromAmount}
          />
        </div>
        <div className="">
          <h2 className="text-lg font-semibold">Swap to:</h2>
          <SwapTo tokens={tokens && tokens} selectToken={selectToken} />
        </div>
        <div className="mt-3">
          <p className="">Est amount: {toAmount}</p>
        </div>
      </main>
      <div className="mt-6">
        {/* <button
          onClick={fetchPrice}
          className="mr-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Fetch Price
        </button> */}
        <button
          onClick={fetchQuote}
          className="mr-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
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
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          Execute Swap
        </button>
      </div>{" "}
    </div>
  );
}
