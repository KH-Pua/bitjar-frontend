import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";
import NavBar from "../components/details/NavBar.js";

// Web3 Imports - Can be refactored in the future after we got all the methods out
import Web3 from "web3";
import { Network, Alchemy } from "alchemy-sdk";

// Import Components
import { TokenCard } from "../components/TokenCard/TokenCard.js";

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

  // States for All Token Balances
  const [walletTokens, setWalletTokens] = useState([]);
  const [tokenBalance, setTokenBalance] = useState({});
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
      console.log(`account to check balance: ${account}`);
      // let walletadd = "0x3472ccc4a932cc5c07740781286083048eb4a5f1";
      fetchBalance("0x4ac5e0c3a1114d47459a818c85348068745d7cd5");
    }

    // Prevent duplicate calls.
    if (account && balance !== "0") {
      const address = "0x3472ccc4a932cc5c07740781286083048eb4a5f1"; // Using spencer's demo address currently cause my own wallet got no Tokens
      getWalletAllTokenBalances(address);
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

  const getWalletAllTokenBalances = async () => {
    // Get token balances
    const address = "0x3472ccc4a932cc5c07740781286083048eb4a5f1"; // Using spencer's demo address currently cause my own wallet got no Tokens
    const balances = await alchemy.core.getTokenBalances(address);

    /**
     * Additional Functionality to remove all token balance = 0,
     * followed by calling get token metadata function to convert the contractAddress to human-readable string
     */
    // Remove tokens with zero balance
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== "0";
    });

    // Counter for SNo of final output
    let i = 1;

    // Loop through all tokens with non-zero balance
    // use getTokenMetadata for human-readable format.
    for (let token of nonZeroBalances) {
      // Get balance of token
      let balance = token.tokenBalance;

      // Get metadata of token
      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress,
      );

      // Compute token balance in human-readable format
      balance = balance / Math.pow(10, metadata.decimals);
      balance = balance.toFixed(2);

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
            {/* Maybe move wallet address to Status Bar at top
            <h2>Wallet Address:</h2>
            <p>{account}</p> */}
            <div>
              <h2 className="font-semibold text-slate-600">Net Worth:</h2>
              <p className="text-[2rem] font-semibold"> xxx USD</p>
              {/* <h2>Wallet ETH Balance:</h2> <p>{balance} ETH</p> */}
            </div>
            {/* <div>
              <h2 className="font-semibold text-slate-600">Supplied Value:</h2>
              <p className="text-[2rem] font-semibold"> xxx USD</p>
            </div>
            <div>
              <h2 className="font-semibold text-slate-600">Borrowed Value:</h2>
              <p className="text-[2rem] font-semibold"> xxx USD</p>
            </div> */}
          </div>
        )}

        {/* User's Supplied Assets */}
        {!account ? null : (
          <>
            <div className="pb-[2em]">
              <h1 className="text-xl font-bold">AAVE Suppliable Assets</h1>
              <div>
                <h2>Wallet Address:</h2> <p>{account}</p>
                <br />
                <h2>Wallet ETH Balance:</h2> <p>{balance} ETH</p>
              </div>
            </div>
          </>
        )}

        {!account ? null : (
          <div>
            <h1 className="pb-[1em] text-xl font-bold">DeFi Assets</h1>
            <div className="flex flex-row flex-wrap justify-center gap-x-[1em] gap-y-[.5em]">
              {imagesFlag && coinImage
                ? // && account
                  walletTokens.map((element, index) => {
                    console.log(`element is ${element}`);
                    // console.log(coinImage.element) // NOT SURE WHY THIS SYNTAX DOESNT WORK??
                    console.log(coinImage[element]);
                    return (
                      <div
                        key={element}
                        className="flex w-[20%] flex-col items-center rounded-md border bg-slate-100 py-[1em]"
                      >
                        <div className="font-semibold">{element}</div>
                        {coinImage[element] ? (
                          <TokenCard imagesrc={coinImage[element]} />
                        ) : (
                          <TokenCard imagesrc="https://icon-library.com/images/cancel-icon-transparent/cancel-icon-transparent-5.jpg" />
                        )}
                        <p>Balance:</p>
                        <p>{tokenBalance[element]}</p>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
