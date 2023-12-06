//-----------Libraries-----------//
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";
import axios from "axios";

// Web3 Imports - Can be refactored in the future after we got all the methods out
import Web3 from "web3";
import { Network, Alchemy } from "alchemy-sdk";

// Import Components
import { TokenCard } from "../components/TokenCard/TokenCard.js";
import { TransactionHistoryTable } from "../components/Dashboard/TransactionHistoryTable.js";

// Import Utils
import { AAVE_ETH_CHAIN_COINLIST } from "../utilities/aaveEthChainAssetList.js";

// Web3 settings
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);
let web3;

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function DashboardPage() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);

  // States for AAVE Support Token Balances
  const [walletTokens, setWalletTokens] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [coinImage, setCoinImage] = useState({});
  const [imagesFlag, setImagesFlag] = useState(false);

  // Total Holdings and Total Earnings
  const [totalHoldings, setTotalHoldings] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      // console.log("metamask detected");
      web3 = new Web3(window.ethereum);

      let walletaddress = localStorage.getItem("connection_meta");
      console.log("wallet address is: ", walletaddress);
      setAccount(walletaddress);
    }
  }, []);

  // When wallet is connected and account address is saved:
  // 1. Display ETH balance as numerical value
  // 2. Get all Tokens and Display
  useEffect(() => {
    if (account) {
      fetchBalance(account);
      getUserTotalHoldings();
    }

    if (account && tokenBalance == null) {
      getWalletAaveSupportedCoins(account);
    }
  }, [account]);

  const getUserTotalHoldings = async () => {
    console.log(`enter getUserTotalHoldings`);
    let userId = 1; // Need to get from base template

    // Get User's past transactions on bitjar
    const pastBitjarTransactions = await axios.post(
      `${BACKEND_URL}/users/getUserPastTransactions`,
      { userId: userId },
    );

    const userPastBitjarTransactions = pastBitjarTransactions.data.data;

    let coinSymbolsList = [];
    let walletCoinAmount = {};

    // Get Transacted Coin Symbol and Coin Amounts
    for (const coin in userPastBitjarTransactions) {
      let coinSymbol =
        userPastBitjarTransactions[coin].product.productName.split(" ")[0];
      coinSymbolsList.push(coinSymbol);
      walletCoinAmount[coinSymbol] = userPastBitjarTransactions[coin].amount;
    }

    console.log(`walletCoinAmount is ${JSON.stringify(walletCoinAmount)}`);
    console.log(`coinSymbolsList is ${coinSymbolsList}`);

    let coinData = {};

    // Get Latest Coin Information from CMC
    console.log("Running CMC API Calls?");
    await Promise.all(
      Object.keys(coinSymbolsList).map(async (symbol) => {
        // console.log(`symbol is ${symbol}`);
        // console.log(`the symbol is: "${coinSymbolsList[symbol]}"`);
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
    // for (const key in coinLatestData) {
    for (const key in coinData) {
      // console.log(`${key}`);
      // console.log(
      //   coinData[`${key}`].data[`${key}`.toUpperCase()].quote.USD.price,
      // );

      let price =
        coinData[`${key}`].data[`${key}`.toUpperCase()].quote.USD.price;

      latestCoinPrices[`${key}`] = price;
    }

    // Calculate Total Holdings
    let totalHoldings = 0.0;
    // console.log(
    //   `initialise calculateTotalHoldings for: ${JSON.stringify(
    //     walletCoinAmount,
    //   )} and ${JSON.stringify(latestCoinPrices)}`,
    // );
    for (const key in walletCoinAmount) {
      // console.log(`The value of ${key} held is: `, coinAmount[`${key}`]);
      let sum = walletCoinAmount[`${key}`] * latestCoinPrices[`${key}`];
      // console.log(sum);
      totalHoldings += sum;
    }
    // console.log("total holdings is:", parseFloat(totalHoldings.toFixed(2)));
    let holdings = parseFloat(totalHoldings.toFixed(2));
    setTotalHoldings(holdings);
  };

  const fetchBalance = async (address) => {
    try {
      const balanceWei = await web3.eth.getBalance(address);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      setBalance(balanceEth);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const getWalletAaveSupportedCoins = async (account) => {
    console.log(`here is the list of aave: ${AAVE_ETH_CHAIN_COINLIST}`);
    let PromiseList = [];
    let tokenContractList = [];

    // For ERC-20 Tokens
    for (const key in AAVE_ETH_CHAIN_COINLIST) {
      let tokenContractAddress = AAVE_ETH_CHAIN_COINLIST[key];
      tokenContractList.push(tokenContractAddress);
    }
    console.log(tokenContractList);

    // const eth_balance = await alchemy.core.getBalance(account, "latest");
    // console.log(eth_balance);

    const data = await alchemy.core.getTokenBalances(
      account,
      tokenContractList,
    );

    console.log("Token balance for Address");
    console.log(data);

    let i = 1;

    for (let token of data.tokenBalances) {
      // Get balance of token
      let balance = token.tokenBalance;

      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress,
      );

      if (balance != 0) {
        // Compute token balance in human-readable format
        balance = balance / Math.pow(10, metadata.decimals);
        balance = balance.toFixed(2);
      } else {
        balance = 0;
      }
      // Print name, balance, and symbol of token
      console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);
      console.log(`Image is: ${metadata.logo}`);

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
    console.log("All Images Loaded");
  };

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      console.log("these are the accounts: ", accounts);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance("0");
    setTransactions([]);
  };

  return (
    <div className="flex w-full flex-row ">
      <div className="flex w-full flex-col justify-center gap-[.5em] px-3">
        <h1 className="p-0 pb-[1em] text-3xl font-bold text-black">
          Dashboard
        </h1>
        <div>
          {!account ? (
            <button onClick={connectWallet} className="connectWalletBtn">
              CONNECT METAMASK
            </button>
          ) : (
            <button onClick={disconnectWallet} className="disconnectWalletBtn">
              Disconnect MetaMask
            </button>
          )}
        </div>
        {/* User Primary Information */}
        {!account ? null : (
          <div className="flex w-full flex-row justify-start gap-[3em] pb-[2em]">
            <div>
              <h2 className="font-semibold text-slate-700">Total Holdings:</h2>
              <p className="text-[.7rem] font-semibold text-slate-400">
                with BitJar
              </p>
              <p className="text-[2rem] font-semibold">
                {totalHoldings != null && totalHoldings} USD
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-slate-700">Total Earnings:</h2>
              <p className="text-[.7rem] font-semibold text-slate-400">
                with Bitjar
              </p>
              <p className="text-[2rem] font-semibold"> xxx USD</p>
            </div>
          </div>
        )}
        {/* User's Assets */}
        {!account ? null : (
          <>
            <div className=" pb-[2em]">
              <h1 className="pb-[1em] text-xl font-bold">Assets</h1>
              <div>
                <h2 className="font-semibold text-slate-700">
                  Wallet Balance:
                </h2>
                <div className="flex w-full flex-row justify-start ">
                  <div>
                    <p className="text-[1.5rem]  font-semibold">
                      {balance} ETH
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {!account ? null : (
          <div className="h-full w-full pb-[1em]">
            <h2 className="pb-[1em] font-semibold text-slate-700">
              Supported Coin Balances:
            </h2>
            {/* Not sure how to express the Height as a proportion, % didnt work.. Hardcoded it for now */}
            <div className="flex h-[13em] w-full flex-col flex-wrap justify-start gap-x-[.5em] gap-y-[.5em] overflow-x-scroll ">
              {imagesFlag && coinImage
                ? walletTokens.map((element, index) => {
                    console.log(`element is ${element}`);
                    console.log(coinImage[element]);
                    return (
                      <div
                        key={element}
                        className="flex min-w-[10em] flex-col items-center rounded-md border bg-slate-100 py-[1em] lg:w-[8em]"
                      >
                        <div className="pb-[1em] font-bold">{element}</div>
                        {coinImage[element] ? (
                          <TokenCard imagesrc={coinImage[element]} />
                        ) : (
                          <TokenCard imagesrc="https://icon-library.com/images/cancel-icon-transparent/cancel-icon-transparent-5.jpg" />
                        )}
                        <p className="pt-[1em] text-[.7rem] font-semibold text-slate-500">
                          Balance:
                        </p>
                        <p>
                          <span className="inline text-[1rem] font-semibold">
                            {tokenBalance[element]}{" "}
                          </span>
                          <span className="inline text-[.8rem] font-bold">
                            {element}
                          </span>
                        </p>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        )}
        {/* User's Transactions on BitJar */}
        {!account ? null : (
          <div className="pb-[2em]">
            <h1 className="pb-[1em] text-xl font-bold">Transactions</h1>
            <figure>
              <TransactionHistoryTable userId="1" />
            </figure>
          </div>
        )}
      </div>
    </div>
  );
}
