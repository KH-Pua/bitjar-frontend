import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../providers/globalProvider.js";
import axios from "axios";
import Web3 from "web3";

export default function SwapPage() {
  const [tokens, setTokens] = useState([]);
  const [currentTrade, setCurrentTrade] = useState({ from: null, to: null });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [swapQuote, setSwapQuote] = useState(null);
  const infoToPass = useContext(GlobalContext);

  // Add your 0x API key here
  const API_KEY = process.env.REACT_APP_0X_KEY;

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
      setTokens(response.data.tokens);
    };
    listAvailableTokens();
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setConnected(true);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  // Select Token
  const selectToken = (token, side) => {
    const updatedTrade = { ...currentTrade, [side]: token };
    setCurrentTrade(updatedTrade);
  };

  const fetchPrice = async () => {
    if (!currentTrade.from || !currentTrade.to || !fromAmount) return;

    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: Web3.utils.toWei(fromAmount, "ether"),
      takerAddress: account,
    };

    try {
      const priceResponse = await axios.get(
        `https://api.0x.org/swap/v1/price?${new URLSearchParams(params)}`,
        headers,
      );
      const amountInEther = Web3.utils.fromWei(
        priceResponse.data.buyAmount.toString(),
        "ether",
      );

      setToAmount(amountInEther.toString());
    } catch (error) {
      console.error("Error fetching price or quote", error);
    }
  };

  const fetchQuote = async () => {
    if (!currentTrade.from || !currentTrade.to || !fromAmount) return;

    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: Web3.utils.toWei(fromAmount, "ether"),
      takerAddress: account,
    };

    console.log(params);

    try {
      const quoteResponse = await axios.get(
        `https://api.0x.org/swap/v1/quote?${new URLSearchParams(params)}`,
        headers,
      );
      setSwapQuote(quoteResponse.data);
      console.log(swapQuote);
    } catch (error) {
      console.error("Error fetching quote", error);
    }
  };

  // Execute swap
  const executeSwap = async () => {
    if (!swapQuote || !account) return;

    // Use the existing provider from the MetaMask connection
    const web3 = new Web3(window.ethereum);

    try {
      await web3.eth.sendTransaction({
        from: account,
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

  const handleAmountChange = (e) => {
    setFromAmount(e.target.value);
  };

  return (
    <div className="mt-12 rounded-lg bg-white p-4 text-black shadow-md">
      <h1 className="text-2xl font-bold">SwapPage</h1>
      {connected ? (
        <p className="mt-4">
          Connected: <span className="font-semibold">{account}</span>
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Select Token:</h2>
        <select
          className="mt-2 block w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 leading-tight focus:border-gray-500 focus:bg-gray-600 focus:outline-none"
          onChange={(e) =>
            selectToken(
              tokens.find((token) => token.symbol === e.target.value),
              "from",
            )
          }
          value={currentTrade.from ? currentTrade.from.symbol : ""}
        >
          <option disabled>Select a token</option>
          {tokens.map((token, index) => (
            <option key={index} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6">
        <label className="block text-lg">From (Amount):</label>
        <input
          type="text"
          value={fromAmount}
          onChange={handleAmountChange}
          className="mt-2 rounded border border-gray-300 p-2"
        />
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Select Token:</h2>
        <select
          className="mt-2 block w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 leading-tight focus:border-gray-500 focus:bg-gray-600 focus:outline-none"
          onChange={(e) =>
            selectToken(
              tokens.find((token) => token.symbol === e.target.value),
              "to",
            )
          }
          value={currentTrade.to ? currentTrade.to.symbol : ""}
        >
          <option disabled>Select a token</option>
          {tokens.map((token, index) => (
            <option key={index} value={token.symbol}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6">
        <label className="block text-lg">To (Amount):</label>
        <input
          type="text"
          value={toAmount}
          readOnly
          className="mt-2 rounded border border-gray-300 p-2"
        />
      </div>
      <div className="mt-6">
        <button
          onClick={fetchPrice}
          className="mr-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Fetch Price
        </button>
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
