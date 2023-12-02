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
  const [wethAmount, setWethAmount] = useState("");
  const [wbtcAmount, setWbtcAmount] = useState("");
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

  const handleWethAmountChange = (e) => {
    setWethAmount(e.target.value);
  };

  const handleWbtcAmountChange = (e) => {
    setWbtcAmount(e.target.value);
  };

  const supplyWETH = async () => {
    if (!account || !wethAmount) return;

    try {
      const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

      const wethContract = new web3.eth.Contract(erc20ABI, wethTokenAddress);
      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      // Approve the LendingPool contract to spend your WETH
      const amountInWei = web3.utils.toWei(wethAmount, "ether");
      await wethContract.methods
        .approve(lendingPoolAddress, amountInWei)
        .send({ from: account });

      // Deposit WETH into the LendingPool
      await lendingPoolContract.methods
        .deposit(wethTokenAddress, amountInWei, account, 0)
        .send({ from: account });

      console.log("Deposited", wethAmount, "WETH to Aave v3");
    } catch (error) {
      console.error("Error in supplying WETH:", error);
    }
  };

  const withdrawWETH = async () => {
    if (!account || !wethAmount) return;

    try {
      const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      // Convert the amount to Wei
      const amountInWei = web3.utils.toWei(wethAmount, "ether");

      // Withdraw WETH from the LendingPool
      await lendingPoolContract.methods
        .withdraw(wethTokenAddress, amountInWei, account)
        .send({ from: account });

      console.log("Withdrew", wethAmount, "WETH from Aave v3");
    } catch (error) {
      console.error("Error in withdrawing WETH:", error);
    }
  };

  const toSatoshi = (amount) => {
    // WBTC has 8 decimal places
    // Multiply the amount by 10^8 to convert to satoshi
    return (parseFloat(amount) * Math.pow(10, 8)).toString();
  };

  const supplyWBTC = async () => {
    if (!account || !wbtcAmount) return;

    try {
      const wbtcTokenAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
      const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

      const wbtcContract = new web3.eth.Contract(erc20ABI, wbtcTokenAddress);
      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      // Convert the amount to satoshi for WBTC
      const amountInSatoshi = toSatoshi(wbtcAmount);
      await wbtcContract.methods
        .approve(lendingPoolAddress, amountInSatoshi)
        .send({ from: account });

      await lendingPoolContract.methods
        .deposit(wbtcTokenAddress, amountInSatoshi, account, 0)
        .send({ from: account });

      console.log("Deposited", wbtcAmount, "WBTC to Aave v3");
    } catch (error) {
      console.error("Error in supplying WBTC:", error);
    }
  };

  const withdrawWBTC = async () => {
    if (!account || !wbtcAmount) return;

    try {
      const wbtcTokenAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
      const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      const amountInSatoshi = toSatoshi(wbtcAmount);
      await lendingPoolContract.methods
        .withdraw(wbtcTokenAddress, amountInSatoshi, account)
        .send({ from: account });

      console.log("Withdrew", wbtcAmount, "WBTC from Aave v3");
    } catch (error) {
      console.error("Error in withdrawing WBTC:", error);
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

  const ProductCard = ({ title, onDeposit, onWithdraw, onChange, amount }) => {
    return (
      <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="mt-4">
          <input
            type="text"
            value={amount}
            onChange={onChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Amount"
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={onDeposit}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Deposit
            </button>
            <button
              onClick={onWithdraw}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    );
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
          <h2>Wallet ETH Balance: {balance} ETH</h2>
          <h3>Last 2 Transactions:</h3>
          <ul>
            {transactions.map((tx, index) => (
              <li key={index}>
                {tx.hash} - {web3.utils.fromWei(tx.value, "ether")} ETH
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProductCard
              title="WETH"
              amount={wethAmount}
              onChange={handleWethAmountChange}
              onDeposit={supplyWETH}
              onWithdraw={withdrawWETH}
            />
            <ProductCard
              title="WBTC"
              amount={wbtcAmount}
              onChange={handleWbtcAmountChange}
              onDeposit={supplyWBTC}
              onWithdraw={withdrawWBTC}
            />
          </div>
        </div>
      )}
    </div>
  );
}
