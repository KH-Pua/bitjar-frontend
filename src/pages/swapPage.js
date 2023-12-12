//-----------Libraries-----------//
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Web3 from "web3";

//-----------Components-----------//
import SwapFrom from "../components/Swap/SwapFrom";
import SwapTo from "../components/Swap/SwapTo";
import { ConnectWalletDefault } from "../components/ConnectWalletDefault/ConnectWalletDefault";

//-----------Utilties-----------//
import { formatWalletAddress } from "../utilities/formatting";
import { SwapResult } from "../components/Swap/SwapResult";
import { apiRequest } from "../utilities/apiRequests";
import erc20ABI from "../utilities/erc20.abi.json";

let web3;

export default function SwapPage() {
  // Constants
  const API_KEY = process.env.REACT_APP_0X_KEY;
  const address = useOutletContext();

  // Variables
  const [tokens, setTokens] = useState([]);
  const [currentTrade, setCurrentTrade] = useState({ from: null, to: null });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [swapQuote, setSwapQuote] = useState(null);
  const [gasPrice, setGasPrice] = useState(0);
  const [gasPriceUsd, setGasPriceUsd] = useState(0);
  const [swapText, setSwapText] = useState("Swap");

  // Pass in as Props to Swap Components in order to set state in Parent component
  const [fromCoin, setFromCoin] = useState(null);
  const [toCoin, setToCoin] = useState(null);

  // Headers for 0x API requests
  const headers = {
    headers: {
      "0x-api-key": API_KEY,
    },
  };

  // Fetch token list on component mount
  useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    }

    const listAvailableTokens = async () => {
      const response = await apiRequest.get(
        "https://tokens.coingecko.com/uniswap/all.json",
      );

      // Filter tokens by specific symbols (BTC, ETH, USDC)
      const filteredTokens = response.data.tokens.filter((token) =>
        ["WBTC", "WETH", "USDC", "DAI", "USDT"].includes(token.symbol),
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

  useEffect(() => {
    if (currentTrade.from || currentTrade.to || fromAmount) {
      fetchPrice();
    }
  }, [currentTrade.from, currentTrade.to, fromAmount]);

  const fetchPrice = async () => {
    setSwapText("Swap");
    setSwapQuote(null); // Reset swap code to null if re-fetching
    if (!currentTrade.from || !currentTrade.to || !fromAmount) return;

    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: fromAmount * 10 ** currentTrade.from.decimals,
      takerAddress: address,
    };
    setToAmount("Fetching Price...");
    console.log("fetchpriceParams", params);

    let searchparams = new URLSearchParams(params);

    try {
      const priceResponse = await apiRequest.get(
        `https://api.0x.org/swap/v1/price?${searchparams.toString()}`,
        headers,
      );

      const convertedAmount =
        priceResponse.data.buyAmount / 10 ** currentTrade.to.decimals;
      setToAmount(convertedAmount);
    } catch (error) {
      console.error("Error fetching price or quote", error);
      setToAmount("Error fetching price, try again");
    }
  };

  // Fetch a firm quote - commitment to fill the market order

  /* (OLD INFO - AUTO CHECK AVAILABLE) Sufficient funds in wallet + 0x Exchange Proxy needs to be approved before 
  using if not error code 111 will come up for being unable to generate gas price

  Step 1: Go to etherscan to approve the token + 0x Proxy
  https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#writeContract
  
  Step 2: Connect wallet and approve
  address: 0xdef1c0ded9bec7f1a1670819833240f027b25eff  // 0x Exchange Proxy
  wad (uint256): 115792089237316195423570985008687907853269984665640564039457584007913129639935
  
  https://0x.org/docs/0x-swap-api/advanced-topics/how-to-set-your-token-allowances
  */
  const fetchQuote = async () => {
    if (!currentTrade.from || !currentTrade.to || !fromAmount)
      return setSwapText("Please fill in all fields");
    setSwapText("Swapping...");
    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: fromAmount * 10 ** currentTrade.from.decimals,
      takerAddress: address,
    };
    const ZeroXAddress = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

    const endquery = new URLSearchParams(params);
    console.log("Fetch Quote query params: ", params);

    try {
      const contract = new web3.eth.Contract(erc20ABI, params.sellToken);
      console.log("contract", contract);

      // Check current allowance
      const currentAllowance = await contract.methods
        .allowance(params.takerAddress, ZeroXAddress)
        .call();

      console.log("allowance", currentAllowance);

      // Compare current allowance with the sellAmount
      if (currentAllowance < params.sellAmount) {
        // Approval is needed -> perform approval
        await contract.methods
          .approve(ZeroXAddress, params.sellAmount)
          .send({ from: params.takerAddress });
      }
      const quoteResponse = await apiRequest.get(
        `https://api.0x.org/swap/v1/quote?${endquery.toString()}`,
        {
          headers: {
            "0x-api-key": API_KEY,
          },
        },
      );
      // quoteResponse.data.gasPrice = 50000000000; // Hardcode - Increase gas price
      setSwapQuote(quoteResponse.data);
      const convertedAmount =
        quoteResponse.data.buyAmount / 10 ** currentTrade.to.decimals;
      setToAmount(convertedAmount);
      // Calculate gas price in ETH and USD
      getGasPrice(quoteResponse.data);
      setSwapText("Swap");
      // Load confirmation Modal
      document.getElementById("swap_modal").showModal();

      console.log("FetchQuote", quoteResponse.data);
    } catch (err) {
      setSwapText("Error swapping, try again");
      console.log(err);
    }
  };

  // Execute swap
  const executeSwap = async () => {
    if (!swapQuote || !address) {
      console.log("failed");
      return;
    }
    try {
      await web3.eth.sendTransaction(swapQuote);
    } catch (error) {
      console.error("Error executing swap", error);
    }
  };

  // Calculate gas price in ETH and USD https://ethereum.stackexchange.com/questions/54606/what-is-difference-between-gas-gas-price-and-fee
  const getGasPrice = async (quote) => {
    // Calculate gas price (Fee = gas*gasPrice)
    let fee = (quote.gasPrice * quote.gas) / 10 ** 18;
    setGasPrice(fee);

    try {
      let information = await apiRequest.post(`users/getCoinLatestInfo`, {
        coinSYM: "ETH",
      });
      const ethPrice = information.data.data.data["ETH"].quote.USD.price;
      const result = fee * ethPrice;
      setGasPriceUsd(result.toFixed(2));
      return result;
    } catch (error) {
      console.error("Error fetching Ethereum price:", error);
    }
  };

  return (
    <>
      {address ? (
        <div className="flex flex-col ">
          <h1 className="text-2xl font-bold">Swap</h1>
          <div className="flex flex-col items-center justify-center ">
            <p className="">
              Swaps powered by{" "}
              <a
                href="https://0x.org/"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-red-700"
              >
                0x Protocol
              </a>
            </p>
            <p className="mb-2">
              Connected:
              <span className="font-semibold">
                {formatWalletAddress(address)}
              </span>
            </p>
            {/* Swap Form */}
            <main className="flex flex-col items-center rounded-xl border-[1px] p-3 py-8">
              <div className="pb-[1em]">
                <h2 className="text-lg font-semibold">Swap from:</h2>
                <SwapFrom
                  tokens={tokens && tokens}
                  selectToken={selectToken}
                  fromAmount={fromAmount}
                  setFromAmount={setFromAmount}
                  setFromCoin={setFromCoin}
                />
              </div>
              <div className=" pb-[1em]">
                <h2 className=" text-lg font-semibold">Swap to:</h2>
                <SwapTo
                  tokens={tokens && tokens}
                  selectToken={selectToken}
                  setToCoin={setToCoin}
                />
              </div>
              <div className="mt-2 rounded-xl bg-slate-100 p-2">
                <p className=" text-[1rem] font-medium text-slate-600">
                  Estimated Price:
                </p>
                <SwapResult
                  fromAmount={fromAmount}
                  toAmount={toAmount}
                  fromCoin={fromCoin}
                  toCoin={toCoin}
                />
              </div>
              {/* Swap buttons */}
              <div className="mt-6 flex flex-row gap-2">
                <button onClick={fetchQuote} className="btn w-72">
                  {swapText}
                </button>
                {/* Swap confirmation modal */}
                <dialog id="swap_modal" className="modal">
                  <div className="modal-box w-[370px]">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                        ✕
                      </button>
                    </form>

                    <main className="flex flex-col items-center">
                      <h3 className="mb-3 text-xl font-bold">Review Swap</h3>
                      <figure className="mb-1 rounded-lg bg-slate-100 p-3">
                        {swapQuote && (
                          <SwapResult
                            fromAmount={fromAmount}
                            toAmount={toAmount}
                            fromCoin={fromCoin}
                            toCoin={toCoin}
                          />
                        )}
                      </figure>
                      <p className="mb-4 animate-pulse text-xs">
                        {" "}
                        {swapQuote &&
                          `Network Cost: ~${gasPrice.toFixed(
                            4,
                          )} ETH ($${gasPriceUsd})`}
                      </p>
                      <button
                        onClick={executeSwap}
                        className=" btn bg-yellow-400 text-white hover:bg-yellow-500"
                      >
                        Confirm Swap
                      </button>
                    </main>
                  </div>
                </dialog>

                {/* Execute Swap */}
              </div>
            </main>
          </div>
        </div>
      ) : (
        <ConnectWalletDefault />
      )}
    </>
  );
}
