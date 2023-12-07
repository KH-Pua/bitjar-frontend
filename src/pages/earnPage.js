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

  //const [earnPage, setEarnPage] = useState("");

  useEffect(() => {
    console.log("wallet add", walletAdd)
    setAccount(walletAdd);
  },[walletAdd])

  useEffect(() => {
    if (account) {
      console.log("run account fetch transactions and balance");
      fetchTransactions(account);
      fetchBalance(account);
    }
    //renderEarnPage();
  }, [account]);

  // useEffect(() => {
  //   renderEarnPage();
  // }, [wethAmount, wbtcAmount, usdcAmount])

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

  // const connectWallet = async () => {
  //   try {
  //     const accounts = await web3.eth.requestAccounts();
  //     console.log("these are the accounts: ", accounts);
  //     setAccount(accounts[0]);
  //   } catch (error) {
  //     console.error("Error connecting to wallet:", error);
  //   }
  // };

  // const disconnectWallet = () => {
  //   setAccount(null);
  //   setBalance("0");
  //   setTransactions([]);
  // };

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
      console.log(balanceWei);
      const balanceEth = web3.utils.fromWei(balanceWei, "ether");
      console.log(balanceEth);
      setBalance(balanceEth);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const ProductCard = ({
    title,
    onDeposit,
    onWithdraw,
    onChange,
    amount,
    tvl,
    apy,
  }) => {
    return (
      <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div>TVL: ${tvl || "Loading..."}</div>
        <div>APY: {apy ? apy.toFixed(2) : "Loading..."}%</div>
        <div className="mt-4">
          <input
            type="text"
            value={amount}
            onChange={(e) => onChange(e)}
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

  const getWalletAllTokenBalances = async () => {
    const address = "0x3472ccc4a932cc5c07740781286083048eb4a5f1"; // Using spencer's demo address currently cause my own wallet got no Tokens
    // Get token balances
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
    // console.log(`The balances of ${address} address are:`, balances);
  };
  
  // const renderEarnPage = () => {
  //   if (account) {
  //     setEarnPage(
  //       <>
  //         <div>
  //           <h2>Wallet Address: {account}</h2>
  //           <h2>Wallet ETH Balance: {balance} ETH</h2>
  //           <h3>Last 2 Transactions:</h3>
  //           <ul>
  //             {transactions.map((tx, index) => (
  //               <li key={index}>
  //                 {tx.hash} - {web3.utils.fromWei(tx.value, "ether")} ETH
  //               </li>
  //             ))}
  //           </ul>
  //           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  //             <ProductCard
  //               title="WETH"
  //               amount={wethAmount}
  //               onChange={handleWethAmountChange}
  //               onDeposit={supplyWETH}
  //               onWithdraw={withdrawWETH}
  //               tvl={wethPoolData.tvlUsd}
  //               apy={wethPoolData.apy}
  //             />
  //             <ProductCard
  //               title="WBTC"
  //               amount={wbtcAmount}
  //               onChange={handleWbtcAmountChange}
  //               onDeposit={supplyWBTC}
  //               onWithdraw={withdrawWBTC}
  //               tvl={wbtcPoolData.tvlUsd}
  //               apy={wbtcPoolData.apy}
  //             />
  //             <ProductCard
  //               title="USDC"
  //               amount={usdcAmount}
  //               onChange={handleUsdcAmountChange}
  //               onDeposit={supplyUSDC}
  //               onWithdraw={withdrawUSDC}
  //               tvl={usdcPoolData.tvlUsd}
  //               apy={usdcPoolData.apy}
  //             />
  //           </div>
  //           <br />
  //           <div className="flex justify-center gap-2">
  //               <button
  //                 onClick={getWalletAllTokenBalances}
  //                 className="mt-10 rounded-md bg-indigo-400 p-2"
  //               >
  //                 Get All Token Balances
  //               </button>
  //               <button
  //                 onClick={() => {
  //                   console.log(coinImage);
  //                 }}
  //                 className="mt-10 rounded-md bg-indigo-400 p-2"
  //               >
  //                 Check Coin Images
  //               </button>
  //           </div>
  //         </div>
  
  //         <div className="flex flex-row flex-wrap gap-x-[1em] gap-y-[.5em]">
  //           {imagesFlag && coinImage && account
  //             ? walletTokens.map((element, index) => {
  //                 console.log(`element is ${element}`);
  //                 // console.log(coinImage.element) // NOT SURE WHY THIS SYNTAX DOESNT WORK??
  //                 console.log(coinImage[element]);
  //                 return (
  //                   <div
  //                     key={element}
  //                     className="flex w-[20%] flex-col items-center rounded-md border bg-slate-100 py-[1em]"
  //                   >
  //                     <div className="font-semibold">{element}</div>
  //                     {coinImage[element] ? (
  //                       <TokenCard imagesrc={coinImage[element]} />
  //                     ) : (
  //                       <TokenCard imagesrc="https://icon-library.com/images/cancel-icon-transparent/cancel-icon-transparent-5.jpg" />
  //                     )}
  //                     <p>Balance:</p>
  //                     <p>{tokenBalance[element]}</p>
  //                   </div>
  //                 );
  //               })
  //             : null}
  //         </div>
  
  //         {/* ... Other components ... */}
  //       </>,
  //     );
  //   } else {
  //     setEarnPage(
  //       <>
  //         <p>Please connect your wallet</p>
  //       </>
  //     );
  //   }
  // };

  return (
    <div className="flex flex-col">
      <h1 className="p-0 text-3xl font-bold text-black">EarnPage</h1>
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
              onChange={(e) => handleWethAmountChange(e)}
              onDeposit={supplyWETH}
              onWithdraw={withdrawWETH}
              tvl={wethPoolData.tvlUsd}
              apy={wethPoolData.apy}
            />
            <ProductCard
              title="WBTC"
              amount={wbtcAmount}
              onChange={(e) => handleWbtcAmountChange(e)}
              onDeposit={supplyWBTC}
              onWithdraw={withdrawWBTC}
              tvl={wbtcPoolData.tvlUsd}
              apy={wbtcPoolData.apy}
            />
            <ProductCard
              title="USDC"
              amount={usdcAmount}
              onChange={(e) => handleUsdcAmountChange(e)}
              onDeposit={supplyUSDC}
              onWithdraw={withdrawUSDC}
              tvl={usdcPoolData.tvlUsd}
              apy={usdcPoolData.apy}
            />
          </div>
          <br />
          <div className="flex justify-center gap-2">
            <button
              onClick={getWalletAllTokenBalances}
              className="mt-10 rounded-md bg-indigo-400 p-2"
            >
              Get All Token Balances
            </button>
            <button
              onClick={() => {
                console.log(coinImage);
              }}
              className="mt-10 rounded-md bg-indigo-400 p-2"
            >
              Check Coin Images
            </button>
          </div>
        </div>
      )}
      {/* {Coins listing} */}
      <div className="flex flex-row flex-wrap gap-x-[1em] gap-y-[.5em]">
        {imagesFlag && coinImage && account
          ? walletTokens.map((element, index) => {
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
      {/* ... Other components ... */}
    </div>
  );
}
