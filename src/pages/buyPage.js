import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../providers/globalProvider.js";
import { loadMoonPay } from "@moonpay/moonpay-js";

export default function BuyPage() {
  const infoToPass = useContext(GlobalContext);
  const navigate = useNavigate();
  // const moonPay = await loadMoonPay();

  // const moonPaySdk = moonPay({
  //   flow: 'buy', // possible values for flow: buy, sell, swapsCustomerSetup
  //   environment: 'sandbox', // possible values for environment: sandbox, production
  //   varient: 'overlay', // possible values for varient: embedded, overlay, newTab, newWindow
  //   params: {
  //     apiKey: 'pk_test_key'
  //   },
  //   debug: true
  // })



  return (
    <div className="flex flex-row">
      <h1 className="p-0 text-3xl font-bold text-black">BuyPage</h1>
    </div>
  );
}
