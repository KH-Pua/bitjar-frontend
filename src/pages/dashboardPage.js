/* eslint-disable react-hooks/exhaustive-deps */
//-----------Libraries-----------//
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

// Web3 Imports - Can be refactored in the future after we got all the methods out
import Web3 from "web3";
import { Network, Alchemy } from "alchemy-sdk";

//-----------Components-----------//
import { ConnectWalletDefault } from "../components/ConnectWalletDefault/ConnectWalletDefault.js";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import TierTable from "../components/rewards/TierTable.js";
import InfoTable from "../components/rewards/InfoTable.js";

//-----------Utilities-----------//
import { AAVE_ETH_CHAIN_COINLIST } from "../utilities/aaveEthChainAssetList.js";
import { getUserData } from "../utilities/apiRequests.js";
import { HoldingsTable } from "../components/Dashboard/HoldingsTable.js";
import { formatEthValue } from "../utilities/formatting.js";

// Web3 settings
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
let web3;

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function DashboardPage() {
  const account = useOutletContext();
  const [user, setUser] = useState("");
  const [balance, setBalance] = useState("0");

  // States for AAVE Support Token Balances
  const [walletTokens, setWalletTokens] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [coinImage, setCoinImage] = useState({});
  const [imagesFlag, setImagesFlag] = useState(false);

  // Total Holdings and Total Earnings
  const [totalHoldings, setTotalHoldings] = useState(null);

  useEffect(() => {
    if (window.ethereum && account) {
      web3 = new Web3(window.ethereum);
    }
  }, []);

  useEffect(() => {
    if (account) {
      fetchUserData();
    }
  }, [account]);

  const fetchUserData = async () => {
    try {
      const user = await getUserData(account);
      setUser(user);
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  };

  // When wallet is connected and account address is saved:
  // 1. Display ETH balance as numerical value
  // 2. Get all Tokens and Display
  useEffect(() => {
    if (account) {
      fetchBalance(account);
      getUserTotalHoldings(account);
    }

    if (account && tokenBalance == null) {
      getWalletAaveSupportedCoins(account);
    }
  }, [account]);

  const getUserTotalHoldings = async (walletaddress) => {
    const pastBitjarTransactions = await axios.get(
      `${BACKEND_URL}/users/holdings/${account}`,
    );

    const userPastBitjarTransactions = pastBitjarTransactions.data.output;

    let coinSymbolsList = [];
    let walletCoinAmount = {};

    // Get Transacted Coin Symbol and Coin Amounts
    for (const coin in userPastBitjarTransactions) {
      let coinSymbol =
        userPastBitjarTransactions[coin].product.productName.split(" ")[0];
      coinSymbolsList.push(coinSymbol);
      walletCoinAmount[coinSymbol] = userPastBitjarTransactions[coin].amount;
    }

    let coinData = {};

    // Get Latest Coin Information from CMC
    await Promise.all(
      Object.keys(coinSymbolsList).map(async (symbol) => {
        let information = await axios.post(
          `${BACKEND_URL}/users/getCoinLatestInfo`,
          {
            coinSYM: coinSymbolsList[symbol],
          },
        );
        // console.log(`information is: ${JSON.stringify(information.data.data)}`);
        coinData[coinSymbolsList[symbol]] = information.data.data;
      }),
    );

    let latestCoinPrices = {};
    // Filter latest price from the above set state.
    for (const key in coinData) {
      let price =
        coinData[`${key}`].data[`${key}`.toUpperCase()].quote.USD.price;

      latestCoinPrices[`${key}`] = price;
    }

    // Calculate Total Holdings
    let totalHoldings = 0.0;
    for (const key in walletCoinAmount) {
      let sum = walletCoinAmount[`${key}`] * latestCoinPrices[`${key}`];
      totalHoldings += sum;
    }
    let holdings = parseFloat(totalHoldings.toFixed(2));
    setTotalHoldings(holdings);
  };

  const fetchBalance = async (address) => {
    try {
      const balanceWei = await web3.eth.getBalance(address);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      setBalance(formatEthValue(balanceEth));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const getWalletAaveSupportedCoins = async (account) => {
    let tokenContractList = [];

    // For ERC-20 Tokens
    for (const key in AAVE_ETH_CHAIN_COINLIST) {
      let tokenContractAddress = AAVE_ETH_CHAIN_COINLIST[key];
      tokenContractList.push(tokenContractAddress);
    }

    const data = await alchemy.core.getTokenBalances(
      account,
      tokenContractList,
    );

    let i = 1;

    for (let token of data.tokenBalances) {
      // Get balance of token
      let balance = token.tokenBalance;

      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress,
      );

      if (balance !== 0) {
        // Compute token balance in human-readable format
        balance = balance / Math.pow(10, metadata.decimals);
        balance = balance.toFixed(2);
      } else {
        balance = 0;
      }
      // Print name, balance, and symbol of token
      console.log(
        `${i++}. ${metadata.name}: ${balance} ${metadata.symbol}${
          metadata.logo
        }`,
      );

      // Store the Symbol to reference images
      // Store the respective token balance
      if (metadata.symbol) {
        setWalletTokens((prevState) => {
          return [...prevState, metadata.symbol];
        });

        setTokenBalance((prevState) => {
          return { ...prevState, [metadata.symbol]: balance };
        });
      }

      // save state as SYMBOL : ImageUrl
      if (metadata.logo) {
        setCoinImage((prevState) => {
          return { ...prevState, [metadata.symbol]: metadata.logo };
        });
      }
    }

    setImagesFlag(true);
  };

  const calculateTier = (points) => {
    if (points >= 0 && points < 1000) {
      return "Silver";
    }

    if (points >= 1000 && points < 10000) {
      return "Gold";
    }

    if (points >= 10000 && points < 100000) {
      return "Platinum";
    }

    if (points >= 100000) {
      return "Diamond";
    }
  };

  return (
    <div className="flex w-full flex-row ">
      <div className="flex w-full flex-col justify-center gap-[.5em] px-3">
        {!account ? (
          <ConnectWalletDefault />
        ) : (
          <h1 className=" text-3xl font-bold text-black">
            Welcome back{user && user.userName ? `, ${user.userName}!` : "!"}
          </h1>
        )}

        {/* User Primary Information */}
        {!account ? null : (
          <dl className="grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-3 lg:grid-cols-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-8 sm:px-6 xl:px-8">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Total Holdings with BitJar
              </dt>
              <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                ${totalHoldings != null && totalHoldings.toLocaleString()}
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-8 sm:px-6 xl:px-8">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Wallet Balance
              </dt>
              <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                {balance} ETH
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-8 sm:px-6 xl:px-8">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                {user && user.points && calculateTier(user.points)}
                {" Tier"}
                <button
                  className="mb-auto scale-100 text-[.9rem] text-slate-600 transition-all hover:scale-95"
                  onClick={() =>
                    document.getElementById("points_info_modal").showModal()
                  }
                >
                  <QuestionMarkCircleIcon className="ml-[.5em] inline h-5 w-5 -translate-y-[0.5px] text-slate-600" />
                </button>
              </dt>
              <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                {user && user.points ? `${user.points} Points` : null}
              </dd>
            </div>
          </dl>
        )}

        <dialog id="points_info_modal" className="modal">
          <div className="modal-box ">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-bold">How to earn points:</h3>
            <p className="bg-yellow-200 text-center">
              Hit your points milestones to get airdrop multipliers!
            </p>
            <TierTable />
            <p className="bg-yellow-200 text-center">
              Perform the following actions daily to rack up points!
            </p>
            <InfoTable />
          </div>
        </dialog>

        {/* User's Assets */}
        {!account ? null : (
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Supported Coin Balances
            </h3>
            {imagesFlag ? null : (
              <div className="mt-5 flex w-full animate-pulse flex-col content-center justify-center text-center font-bold text-slate-600">
                <div className="px-6 py-6 text-lg sm:p-6">LOADING . . .</div>
              </div>
            )}
            <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
              {imagesFlag && coinImage
                ? walletTokens.map((element, index) => (
                    <div key={element} className="flex px-6 py-6 sm:p-6">
                      <div className=" rounded-md p-3">
                        {coinImage[element] ? (
                          <img
                            className="h-12 w-12"
                            src={coinImage[element]}
                            alt="logo"
                          />
                        ) : (
                          <img
                            src="https://icon-library.com/images/cancel-icon-transparent/cancel-icon-transparent-5.jpg"
                            alt="logo"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-grey-900 text-base font-medium">
                          {element}
                        </p>
                        <div className="mt-1 flex items-baseline justify-between md:block lg:flex">
                          <p className="text-grey-900 text-2xl font-semibold">
                            {`${tokenBalance[element]} ${element}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </dl>
          </div>
        )}
        {/* User's Holding on BitJar */}
        {!account ? null : (
          <div className="pb-[2em]">
            <h1 className="pt-12 text-base font-semibold leading-6 text-gray-900">
              Current Holdings
            </h1>
            <div>{account && <HoldingsTable account={account} />}</div>
          </div>
        )}
      </div>
    </div>
  );
}
