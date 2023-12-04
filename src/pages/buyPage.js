//-----------Libraries-----------//
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";
import { MoonPayBuyWidget } from "@moonpay/moonpay-react";

export default function BuyPage() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-row">
      <h1 className="p-0 text-3xl font-bold text-black">BuyPage</h1>
      <div>
        <MoonPayBuyWidget
          variant="embedded"
          baseCurrencyCode="usd"
          baseCurrencyAmount="100"
          defaultCurrencyCode="eth"
          visible={visible}
        />
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => setVisible(!visible)}
        >
          Buy Crypto with MoonPay
        </button>
      </div>
    </div>
  );
}
