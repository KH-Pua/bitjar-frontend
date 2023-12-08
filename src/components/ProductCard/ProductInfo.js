import React, { useState, useEffect } from "react";
import btcIcon from "cryptocurrency-icons/svg/color/btc.svg";
import ethIcon from "cryptocurrency-icons/svg/color/eth.svg";
import usdcIcon from "cryptocurrency-icons/svg/color/usdc.svg";
import { fetchPoolData } from "../../components/api/defillama";

const ProductInfo = () => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wethData = await fetchPoolData(
          "e880e828-ca59-4ec6-8d4f-27182a4dc23d",
        );
        const wbtcData = await fetchPoolData(
          "7e382157-b1bc-406d-b17b-facba43b716e",
        );
        const usdcData = await fetchPoolData(
          "aa70268e-4b52-42bf-a116-608b370f9501",
        );

        setCryptoData([
          { name: "Bitcoin", apy: wbtcData.apy, icon: btcIcon },
          { name: "Ethereum", apy: wethData.apy, icon: ethIcon },
          { name: "USDC", apy: usdcData.apy, icon: usdcIcon },
        ]);
      } catch (error) {
        console.error("Error fetching data from DeFiLlama:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <article className="m-4 flex flex-col gap-3 md:flex-row">
      {cryptoData.map((crypto) => (
        <figure
          key={crypto.name}
          className="flex h-[350px] w-[250px] flex-col items-center justify-center border bg-slate-50 shadow-md transition-all hover:translate-y-[-5px]"
        >
          <img
            src={crypto.icon}
            alt={`${crypto.name} icon`}
            className="h-[10em] w-[10em]"
          />
          <h1 className="mt-[1em] text-[24px] font-bold text-black lg:mt-[2em]">
            {crypto.name}
          </h1>
          <h2>{crypto.apy.toFixed(2)}% APY*</h2>
        </figure>
      ))}
    </article>
  );
};

export default ProductInfo;
