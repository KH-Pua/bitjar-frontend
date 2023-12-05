//-----------Libraries-----------//
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";

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

  useEffect(() => {
    if (window.ethereum) {
      // console.log("metamask detected");
      web3 = new Web3(window.ethereum);
    }
  }, []);

  // When wallet is connected and account address is saved:
  // 1. Display ETH balance as numerical value
  // 2. Get all Tokens and Display
  useEffect(() => {
    if (account) {
      fetchBalance(account);
    }

    // Prevent duplicate calls.
    if (account && tokenBalance == null) {
      getWalletAaveSupportedCoins(account);
    }
  }, [account]);

  const fetchBalance = async (address) => {
    try {
      console.log("Fetching Balance");
      const balanceWei = await web3.eth.getBalance(address);
      console.log(`balance in wei: ${balanceWei}`);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      console.log(`balance in Eth: ${balanceWei}`);
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
      <div className="flex w-full flex-col justify-center gap-[.5em]">
        <h1 className="p-0 text-3xl font-bold text-black">Dashboard</h1>
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
              <p className="text-[2rem] font-semibold"> xxx USD</p>
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
              <h1 className="text-xl font-bold">Assets</h1>
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
            <div className="flex h-[12em] w-full flex-col flex-wrap justify-start gap-x-[.5em] gap-y-[.5em] overflow-x-scroll ">
              {imagesFlag && coinImage
                ? // && account
                  walletTokens.map((element, index) => {
                    console.log(`element is ${element}`);
                    console.log(coinImage[element]);
                    return (
                      <div
                        key={element}
                        className="flex w-[10%] flex-col items-center rounded-md border bg-slate-100 py-[1em]"
                      >
                        <div className="font-semibold">{element}</div>
                        {coinImage[element] ? (
                          <TokenCard imagesrc={coinImage[element]} />
                        ) : (
                          <TokenCard imagesrc="https://icon-library.com/images/cancel-icon-transparent/cancel-icon-transparent-5.jpg" />
                        )}
                        <p>Balance:</p>
                        <p>
                          {tokenBalance[element]} {element}
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
            <h1 className="text-xl font-bold">Transactions</h1>
            <figure>
              <TransactionHistoryTable userId="1" />
            </figure>
          </div>
        )}
      </div>
    </div>
  );
}
