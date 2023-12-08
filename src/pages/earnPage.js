//-----------Libraries-----------//
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Web3 from "web3";
import { Network, Alchemy } from "alchemy-sdk";

//-----------Components-----------//
import { fetchPoolData } from "../utilities/defillama.js";
import ProductCard from "../components/ProductCard/ProductCard.js";
import { TransactionHistoryTable } from "../components/Dashboard/TransactionHistoryTable.js";

//-----------Utilities-----------//
import { formatEthValue, formatCurrency } from "../utilities/formatting.js";
import erc20ABI from "../utilities/erc20.abi.json";
import aaveLendingPoolABI from "../utilities/aaveLendingPoolABI.json";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

let web3;

export default function EarnPage() {
  const account = useOutletContext();

  const tokenAddress = {
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    sepoliaWBTC: "0x29f2D40B0605204364af54EC677bD022dA425d03",
    sepoliaUSDC: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    sepoliaWETH: "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c",
  };

  const lendingPool = {
    main: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    sepolia: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
  };

  //Get staging tokens - https://staging.aave.com/faucet/
  const [amount, setAmount] = useState({
    WBTC: "",
    WETH: "",
    USDC: "",
    sepoliaWETH: "",
    sepoliaWBTC: "",
    sepoliaUSDC: "",
  });

  // const [wethAmount, setWethAmount] = useState("");
  // const [wbtcAmount, setWbtcAmount] = useState("");
  // const [usdcAmount, setUsdcAmount] = useState("");
  // const [sepoliaWbtcAmount, setSepoliaWbtcAmount] = useState("");

  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);

  // Add state for WETH and WBTC pool data
  const [wethPoolData, setWethPoolData] = useState({});
  const [wbtcPoolData, setWbtcPoolData] = useState({});
  const [usdcPoolData, setUsdcPoolData] = useState({});
  const [sepoliaPoolData, setSepoliaPoolData] = useState({});

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

  // Get pool data from Defillama
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
    fetchPoolData("7e382157-b1bc-406d-b17b-facba43b716e").then((data) => {
      console.log("Sepolia Pool Data: ", data);
      setSepoliaPoolData(data);
    });
  }, []);

  const handleAmountChange = (e, setter) => {
    setter(e.target.value);
  };

  // Helper Functions
  const textChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    setAmount((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const deposit = async (token, pool) => {
    console.log("deposit start!", token, pool);
    const depositTokenAddress = tokenAddress[token];
    console.log("TokenAddress", depositTokenAddress);
    const lendingPoolAddress = lendingPool[pool];
    console.log("PoolAddress", lendingPoolAddress);
    const depositAmount = amount[token];
    console.log("DepositAmount", depositAmount);

    let fullDepositAmount;
    if (token.includes("BTC")) {
      fullDepositAmount = toSatoshi(depositAmount);
    } else {
      fullDepositAmount = web3.utils.toWei(depositAmount, "ether");
    }
    console.log("Fulldeposit", fullDepositAmount);

    if (!depositTokenAddress || !lendingPoolAddress || !fullDepositAmount)
      return;
    console.log("Deposit", token, pool);

    try {
      const contract = new web3.eth.Contract(erc20ABI, depositTokenAddress);
      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      await contract.methods
        .approve(lendingPoolAddress, fullDepositAmount)
        .send({ from: account });

      await lendingPoolContract.methods
        .deposit(depositTokenAddress, fullDepositAmount, account, 0)
        .send({ from: account });

      console.log(
        `Deposited ${depositAmount} of ${token} to Aave v3 (${pool})`,
      );
    } catch (error) {
      console.error(`Error in supplying ${token} to ${pool}:`, error);
    }
  };

  const withdraw = async (token, pool) => {
    console.log("withdraw start!", token, pool);
    const withdrawTokenAddress = tokenAddress[token];
    console.log("TokenAddress", withdrawTokenAddress);
    const lendingPoolAddress = lendingPool[pool];
    console.log("PoolAddress", lendingPoolAddress);
    const withdrawAmount = amount[token];
    console.log("WithdrawAmount", withdrawAmount);

    let fullWithdrawAmount;
    if (token.includes("BTC")) {
      fullWithdrawAmount = toSatoshi(withdrawAmount);
    } else {
      fullWithdrawAmount = web3.utils.toWei(withdrawAmount, "ether");
    }
    console.log("Fullwithdraw", fullWithdrawAmount);

    if (!withdrawTokenAddress || !lendingPoolAddress || !fullWithdrawAmount)
      return;
    console.log("start withdraw");

    try {
      const lendingPoolContract = new web3.eth.Contract(
        aaveLendingPoolABI,
        lendingPoolAddress,
      );

      // Withdraw WETH from the LendingPool
      await lendingPoolContract.methods
        .withdraw(withdrawTokenAddress, fullWithdrawAmount, account)
        .send({ from: account });

      console.log(
        `Withdraw ${withdrawAmount} of ${token} from Aave v3 (${pool})`,
      );
    } catch (error) {
      console.error(`Error in withdrawing ${token} from ${pool}:`, error);
    }
  };

  // const supplyWETH = async () => {
  //   if (!account || !wethAmount) return;

  //   try {
  //     const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  //     const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

  //     const wethContract = new web3.eth.Contract(erc20ABI, wethTokenAddress);
  //     const lendingPoolContract = new web3.eth.Contract(
  //       aaveLendingPoolABI,
  //       lendingPoolAddress,
  //     );

  //     // Approve the LendingPool contract to spend your WETH
  //     const amountInWei = web3.utils.toWei(wethAmount, "ether");

  //     console.log(web3.utils.toWei(wethAmount, "ether"));
  //     await wethContract.methods
  //       .approve(lendingPoolAddress, amountInWei)
  //       .send({ from: account });

  //     // Deposit WETH into the LendingPool
  //     await lendingPoolContract.methods
  //       .deposit(wethTokenAddress, amountInWei, account, 0)
  //       .send({ from: account });

  //     console.log("Deposited", wethAmount, "WETH to Aave v3");
  //   } catch (error) {
  //     console.error("Error in supplying WETH:", error);
  //   }
  // };

  // const withdrawWETH = async () => {
  //   if (!account || !wethAmount) return;

  //   try {
  //     const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  //     const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

  //     const lendingPoolContract = new web3.eth.Contract(
  //       aaveLendingPoolABI,
  //       lendingPoolAddress,
  //     );

  //     // Convert the amount to Wei
  //     const amountInWei = web3.utils.toWei(wethAmount, "ether");

  //     // Withdraw WETH from the LendingPool
  //     await lendingPoolContract.methods
  //       .withdraw(wethTokenAddress, amountInWei, account)
  //       .send({ from: account });

  //     console.log("Withdrew", wethAmount, "WETH from Aave v3");
  //   } catch (error) {
  //     console.error("Error in withdrawing WETH:", error);
  //   }
  // };

  const toSatoshi = (amount) => {
    // WBTC has 8 decimal places
    // Multiply the amount by 10^8 to convert to satoshi
    return (parseFloat(amount) * Math.pow(10, 8)).toString();
  };

  // const supplyWBTC = async () => {
  //   if (!account || !wbtcAmount) return;

  //   try {
  //     const wbtcTokenAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  //     const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

  //     const wbtcContract = new web3.eth.Contract(erc20ABI, wbtcTokenAddress);
  //     const lendingPoolContract = new web3.eth.Contract(
  //       aaveLendingPoolABI,
  //       lendingPoolAddress,
  //     );

  //     // Convert the amount to satoshi for WBTC
  //     const amountInSatoshi = toSatoshi(wbtcAmount);
  //     await wbtcContract.methods
  //       .approve(lendingPoolAddress, amountInSatoshi)
  //       .send({ from: account });

  //     await lendingPoolContract.methods
  //       .deposit(wbtcTokenAddress, amountInSatoshi, account, 0)
  //       .send({ from: account });

  //     console.log("Deposited", wbtcAmount, "WBTC to Aave v3");
  //   } catch (error) {
  //     console.error("Error in supplying WBTC:", error);
  //   }
  // };

  // const withdrawWBTC = async () => {
  //   if (!account || !wbtcAmount) return;

  //   try {
  //     const wbtcTokenAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  //     const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

  //     const lendingPoolContract = new web3.eth.Contract(
  //       aaveLendingPoolABI,
  //       lendingPoolAddress,
  //     );

  //     const amountInSatoshi = toSatoshi(wbtcAmount);
  //     await lendingPoolContract.methods
  //       .withdraw(wbtcTokenAddress, amountInSatoshi, account)
  //       .send({ from: account });

  //     console.log("Withdrew", wbtcAmount, "WBTC from Aave v3");
  //   } catch (error) {
  //     console.error("Error in withdrawing WBTC:", error);
  //   }
  // };

  // const supplyUSDC = async () => {
  //   if (!account || !usdcAmount) return;

  //   try {
  //     const usdcTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  //     const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

  //     const wethContract = new web3.eth.Contract(erc20ABI, usdcTokenAddress);
  //     const lendingPoolContract = new web3.eth.Contract(
  //       aaveLendingPoolABI,
  //       lendingPoolAddress,
  //     );

  //     // Approve the LendingPool contract to spend your USDC
  //     const amountInWei = web3.utils.toWei(usdcAmount, "ether");
  //     await wethContract.methods
  //       .approve(lendingPoolAddress, amountInWei)
  //       .send({ from: account });

  //     // Deposit USDC into the LendingPool
  //     await lendingPoolContract.methods
  //       .deposit(usdcTokenAddress, amountInWei, account, 0)
  //       .send({ from: account });

  //     console.log("Deposited", usdcAmount, "USDC to Aave v3");
  //   } catch (error) {
  //     console.error("Error in supplying USDC:", error);
  //   }
  // };

  // const withdrawUSDC = async () => {
  //   if (!account || !usdcAmount) return;

  //   try {
  //     const usdcTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  //     const lendingPoolAddress = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";

  //     const lendingPoolContract = new web3.eth.Contract(
  //       aaveLendingPoolABI,
  //       lendingPoolAddress,
  //     );

  //     const amountInSatoshi = toSatoshi(usdcAmount);
  //     await lendingPoolContract.methods
  //       .withdraw(usdcTokenAddress, amountInSatoshi, account)
  //       .send({ from: account });

  //     console.log("Withdrew", usdcAmount, "USDC from Aave v3");
  //   } catch (error) {
  //     console.error("Error in withdrawing USDC:", error);
  //   }
  // };

  // const supplySepoliaWBTC = async () => {
  //   if (!account || !sepoliaWbtcAmount) return;

  //   try {
  //     console.log("Supply Sepolia WBTC");
  //     const wbtcTokenAddress = "0x29f2D40B0605204364af54EC677bD022dA425d03";
  //     const lendingPoolAddress = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";

  //     const wbtcContract = new web3.eth.Contract(erc20ABI, wbtcTokenAddress);
  //     const lendingPoolContract = new web3.eth.Contract(
  //       aaveLendingPoolABI,
  //       lendingPoolAddress,
  //     );

  //     // Convert the amount to satoshi for WBTC
  //     const amountInSatoshi = toSatoshi(sepoliaWbtcAmount);
  //     await wbtcContract.methods
  //       .approve(lendingPoolAddress, amountInSatoshi)
  //       .send({ from: account });

  //     await lendingPoolContract.methods
  //       .deposit(wbtcTokenAddress, amountInSatoshi, account, 0)
  //       .send({ from: account });

  //     console.log("Deposited", sepoliaWbtcAmount, "Sepolia WBTC to Aave v3");
  //   } catch (error) {
  //     console.error("Error in supplying WBTC:", error);
  //   }
  // };

  // const withdrawSepoliaWBTC = async () => {
  //   if (!account || !sepoliaWbtcAmount) return;

  //   try {
  //     const sepoliaWbtcTokenAddress =
  //       "0x29f2D40B0605204364af54EC677bD022dA425d03";
  //     const lendingPoolAddress = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";

  //     const lendingPoolContract = new web3.eth.Contract(
  //       aaveLendingPoolABI,
  //       lendingPoolAddress,
  //     );

  //     const amountInSatoshi = toSatoshi(sepoliaWbtcAmount);
  //     await lendingPoolContract.methods
  //       .withdraw(sepoliaWbtcTokenAddress, amountInSatoshi, account)
  //       .send({ from: account });

  //     console.log("Withdrew", sepoliaWbtcAmount, "Sepolia WBTC from Bitjar");
  //   } catch (error) {
  //     console.error("Error in withdrawing Sepolia WBTC:", error);
  //   }
  // };

  const fetchTransactions = async (address) => {
    try {
      const response = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: address,
        category: ["erc721", "external", "erc20"],
        maxCount: "0x10",
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
      <h1 className="text-3xl font-bold leading-6 text-gray-900">Earn</h1>
      {account && (
        <div>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Wallet Address
              </dt>
              <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                {account}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Wallet ETH Balance
              </dt>
              <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                {formatEthValue(balance)} ETH
              </dd>
            </div>
          </dl>

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
                id="WETH"
                title="WETH"
                description="Lend on Aave V3 protocol"
                amount={amount.WETH}
                handleChange={(e) => textChange(e)}
                onDeposit={() => deposit("WETH", "main")}
                onWithdraw={() => withdraw("WTH", "main")}
                tvl={formatCurrency(wethPoolData.tvlUsd)}
                apy={wethPoolData.apy}
                currency="ETH"
              />
              <ProductCard
                id="WBTC"
                title="WBTC"
                description="Lend on Aave V3 protocol"
                amount={amount.WBTC}
                handleChange={(e) => textChange(e)}
                onDeposit={() => deposit("WBTC", "main")}
                onWithdraw={() => withdraw("WBTC", "main")}
                tvl={formatCurrency(wbtcPoolData.tvlUsd)}
                apy={wbtcPoolData.apy}
                currency="BTC"
              />
              <ProductCard
                id="USDC"
                title="USDC"
                description="Lend on Aave V3 protocol"
                amount={amount.USDC}
                handleChange={(e) => textChange(e)}
                onDeposit={() => deposit("USDC", "main")}
                onWithdraw={() => withdraw("USDC", "main")}
                tvl={formatCurrency(usdcPoolData.tvlUsd)}
                apy={usdcPoolData.apy}
                currency="USDC"
              />
              <ProductCard
                id="sepoliaWETH"
                title="SEPOLIA WTH"
                description="Lend on Aave V3 protocol"
                amount={amount.sepoliaWETH}
                handleChange={(e) => textChange(e)}
                onDeposit={() => deposit("sepoliaWETH", "sepolia")}
                onWithdraw={() => withdraw("sepoliaWETH", "sepolia")}
                tvl={formatCurrency(wethPoolData.tvlUsd)}
                apy={wethPoolData.apy}
                currency="ETH"
              />
              <ProductCard
                id="sepoliaWBTC"
                title="SEPOLIA WBTC"
                description="Lend on AAVE V3 testnet"
                amount={amount.sepoliaWBTC}
                handleChange={(e) => textChange(e)}
                onDeposit={() => deposit("sepoliaWBTC", "sepolia")}
                onWithdraw={() => withdraw("sepoliaWBTC", "sepolia")}
                tvl={formatCurrency(sepoliaPoolData.tvlUsd)}
                apy={sepoliaPoolData.apy}
                currency="BTC"
              />
              <ProductCard
                id="sepoliaUSDC"
                title="SEPOLIA USDC"
                description="Lend on AAVE V3 testnet"
                amount={amount.sepoliaUSDC}
                handleChange={(e) => textChange(e)}
                onDeposit={() => deposit("sepoliaUSDC", "sepolia")}
                onWithdraw={() => withdraw("sepoliaUSDC", "sepolia")}
                tvl={formatCurrency(usdcPoolData.tvlUsd)}
                apy={usdcPoolData.apy}
                currency="USDC"
              />
            </div>
            <br />
          </div>
        </div>
      )}

      {/* User's Transactions on BitJar */}
      {!account ? null : (
        <div className="pb-[2em]">
          <h1 className="pt-12 text-base font-semibold leading-6 text-gray-900">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of past 5 transactions ordered by timestamp
          </p>
          <div>{account && <TransactionHistoryTable account={account} />}</div>
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
