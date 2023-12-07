//-----------Libraries-----------//
import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import Web3 from "web3";
import { Network, Alchemy } from "alchemy-sdk";
import erc20ABI from "../utilities/erc20.abi.json";

//-----------Libraries-----------//
import aaveLendingPoolABI from "../utilities/aaveLendingPoolABI.json";
import { fetchPoolData } from "../components/api/defillama.js";
import { GlobalContext } from "../providers/globalProvider.js";

// Import Components
import { TokenCard } from "../components/TokenCard/TokenCard.js";
import { formatEthValue, formatCurrency } from "../utilities/formatting.js";
import ProductCard from "../components/ProductCard/ProductCard.js";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

let web3;

export default function EarnPage() {
  const walletAdd = useOutletContext();
  const infoToPass = useContext(GlobalContext);
  const [account, setAccount] = useState("");
  const [wethAmount, setWethAmount] = useState("");
  const [wbtcAmount, setWbtcAmount] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);

  const [walletTokens, setWalletTokens] = useState([]);
  const [tokenBalance, setTokenBalance] = useState({});
  const [coinImage, setCoinImage] = useState({});
  const [imagesFlag, setImagesFlag] = useState(false);

  // Add state for WETH and WBTC pool data
  const [wethPoolData, setWethPoolData] = useState({});
  const [wbtcPoolData, setWbtcPoolData] = useState({});
  const [usdcPoolData, setUsdcPoolData] = useState({});

  useEffect(() => {
    setAccount(walletAdd);
  }, [walletAdd]);

  useEffect(() => {
    if (account) {
      fetchTransactions(account);
      fetchBalance(account);
    }
  }, [account]);

  useEffect(() => {
    //Check for web3 wallet
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    }
  }, []);

  useEffect(() => {
    fetchPoolData("e880e828-ca59-4ec6-8d4f-27182a4dc23d").then((data) => {
      console.log("WETH Pool Data: ", data);
      setWethPoolData(data);
    });
    fetchPoolData("7e382157-b1bc-406d-b17b-facba43b716e").then((data) => {
      console.log("WBTC Pool Data: ", data);
      setWbtcPoolData(data);
    });
    fetchPoolData("aa70268e-4b52-42bf-a116-608b370f9501").then((data) => {
      console.log("USDC Pool Data: ", data);
      setUsdcPoolData(data);
    });
  }, []);

  const handleWethAmountChange = (e) => {
    setWethAmount(e.target.value);
  };

  const handleWbtcAmountChange = (e) => {
    setWbtcAmount(e.target.value);
  };

  const handleUsdcAmountChange = (e) => {
    setUsdcAmount(e.target.value);
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

      console.log(web3.utils.toWei(wethAmount, "ether"));
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

  const supplyUSDC = async () => {
    if (!account || !usdcAmount) return;

    try {
      const usdcTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

      const wethContract = new web3.eth.Contract(erc20ABI, usdcTokenAddress);
      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      // Approve the LendingPool contract to spend your USDC
      const amountInWei = web3.utils.toWei(usdcAmount, "ether");
      await wethContract.methods
        .approve(lendingPoolAddress, amountInWei)
        .send({ from: account });

      // Deposit USDC into the LendingPool
      await lendingPoolContract.methods
        .deposit(usdcTokenAddress, amountInWei, account, 0)
        .send({ from: account });

      console.log("Deposited", usdcAmount, "USDC to Aave v3");
    } catch (error) {
      console.error("Error in supplying USDC:", error);
    }
  };

  const withdrawUSDC = async () => {
    if (!account || !usdcAmount) return;

    try {
      const usdcTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      const amountInSatoshi = toSatoshi(usdcAmount);
      await lendingPoolContract.methods
        .withdraw(usdcTokenAddress, amountInSatoshi, account)
        .send({ from: account });

      console.log("Withdrew", usdcAmount, "USDC from Aave v3");
    } catch (error) {
      console.error("Error in withdrawing USDC:", error);
    }
  };

  const fetchTransactions = async (address) => {
    try {
      const response = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: address,
        category: ["erc721", "external", "erc20"],
        maxCount: "0x5",
      });
      setTransactions(response.transfers);
      console.log(response.transfers);
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
      <h1 className="p-0 text-3xl font-bold text-black">
        Earn by staking or lending
      </h1>
      {account && (
        <div>
          <h2>Wallet Address: {account}</h2>
          <h2>Wallet ETH Balance: {formatEthValue(balance)} ETH</h2>

          <div className="py-4">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Opportunities
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Deposit your crypto to earn yield{" "}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ProductCard
                title="WETH"
                description="Lend on Aave V3 protocol"
                amount={wethAmount}
                onChange={(e) => handleWethAmountChange(e)}
                onDeposit={supplyWETH}
                onWithdraw={withdrawWETH}
                tvl={formatCurrency(wethPoolData.tvlUsd)}
                apy={wethPoolData.apy}
                currency="ETH"
              />
              <ProductCard
                title="WBTC"
                description="Lend on Aave V3 protocol"
                amount={wbtcAmount}
                onChange={(e) => handleWbtcAmountChange(e)}
                onDeposit={supplyWBTC}
                onWithdraw={withdrawWBTC}
                tvl={formatCurrency(wbtcPoolData.tvlUsd)}
                apy={wbtcPoolData.apy}
                currency="BTC"
              />
              <ProductCard
                title="USDC"
                description="Lend on Aave V3 protocol"
                amount={usdcAmount}
                onChange={(e) => handleUsdcAmountChange(e)}
                onDeposit={supplyUSDC}
                onWithdraw={withdrawUSDC}
                tvl={formatCurrency(usdcPoolData.tvlUsd)}
                apy={usdcPoolData.apy}
                currency="USDC"
              />
            </div>
            <br />
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="py-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Blockchain Transactions
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              List of past 5 transactions ordered by block number
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Block Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Value (ETH)
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      To
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {transactions.map((tx, index) => (
                    <tr key={index} className="even:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {tx.blockNum}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatEthValue(tx.value)} ETH
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {tx.from}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {tx.to}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
