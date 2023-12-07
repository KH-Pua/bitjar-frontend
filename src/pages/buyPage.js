//-----------Libraries-----------//
import { useOutletContext } from "react-router-dom";
import { MoonPayBuyWidget } from "@moonpay/moonpay-react";
import BuyTest from "../components/buy/buyTest";

export default function BuyPage() {
  const address = useOutletContext();

  return (
    <div className="flex flex-row">
      <h1 className="p-0 text-3xl font-bold text-black">Buy</h1>
      <div>
        <MoonPayBuyWidget
          variant="embedded"
          baseCurrencyCode="usd"
          baseCurrencyAmount="100"
          defaultCurrencyCode="eth"
          walletAddress={address}
          colorCode="#face5e"
          onLogin={() => {
            console.log("Logging into moonpay");
          }}
          onTransactionCompleted={(props) => {
            console.log("tx complete", props);
          }}
        />
      </div>
      <BuyTest address={address} />
    </div>
  );
}
