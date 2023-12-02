import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { Network, Alchemy } from "alchemy-sdk";
import erc20ABI from "../utilities/erc20.abi.json";
import aaveLendingPoolABI from "../utilities/aaveLendingPoolABI.json";

import { GlobalContext } from "../providers/globalProvider.js";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

let web3;

export default function EarnPage() {
  const infoToPass = useContext(GlobalContext);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    }
  }, []);

  useEffect(() => {
    if (account) {
      fetchTransactions(account);
      fetchBalance(account);
    }
  }, [account]);

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
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

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const supplyWETH = async () => {
    if (!account || !amount) return;

    try {
      const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

      const wethContract = new web3.eth.Contract(erc20ABI, wethTokenAddress);
      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      // Approve the LendingPool contract to spend your WETH
      const amountInWei = web3.utils.toWei(amount, "ether");
      await wethContract.methods
        .approve(lendingPoolAddress, amountInWei)
        .send({ from: account });

      // Deposit WETH into the LendingPool
      await lendingPoolContract.methods
        .deposit(wethTokenAddress, amountInWei, account, 0)
        .send({ from: account });

      console.log("Deposited", amount, "WETH to Aave v3");
    } catch (error) {
      console.error("Error in supplying WETH:", error);
    }
  };

  const withdrawWETH = async () => {
    if (!account || !amount) return;

    try {
      const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      // Convert the amount to Wei
      const amountInWei = web3.utils.toWei(amount, "ether");

      // Withdraw WETH from the LendingPool
      await lendingPoolContract.methods
        .withdraw(wethTokenAddress, amountInWei, account)
        .send({ from: account });

      console.log("Withdrew", amount, "WETH from Aave v3");
    } catch (error) {
      console.error("Error in withdrawing WETH:", error);
    }
  };

  const fetchTransactions = async (address) => {
    try {
      const response = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: address,
        category: ["erc721", "external", "erc20"],
        maxCount: "0x2",
      });
      setTransactions(response.transfers);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
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

  return (
    <div className="flex flex-col">
      <h1 className="p-0 text-3xl font-bold text-black">EarnPage</h1>
      {!account ? (
        <button onClick={connectWallet}>Sign in with MetaMask</button>
      ) : (
        <button onClick={disconnectWallet}>Disconnect MetaMask</button>
      )}
      {account && (
        <div>
          <h2>Wallet Address: {account}</h2>
          <h2>Wallet Balance: {balance} ETH</h2>
          <h3>Last 2 Transactions:</h3>
          <ul>
            {transactions.map((tx, index) => (
              <li key={index}>
                {tx.hash} - {web3.utils.fromWei(tx.value, "ether")} ETH
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Amount of WETH"
          />
          <button onClick={supplyWETH}>Supply WETH to Aave v3</button>
          <button onClick={withdrawWETH}>Withdraw WETH from Aave v3</button>
        </div>
      )}
      {/* ... Other components ... */}
    </div>
  );
}
