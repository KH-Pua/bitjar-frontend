//-----------Libraries-----------//
import { useState, useEffect } from "react";
import { useOutletContext, useRevalidator } from "react-router-dom";
import { MoonPayBuyWidget } from "@moonpay/moonpay-react";

//-----------Components-----------//
import BuyTest from "../components/buy/buyTest";

//-----------Utilities-----------//
import { apiRequest } from "../utilities/apiRequests";
import { purchasePoints } from "../utilities/pointsMessages.js";
import PointNotification from "../components/details/PointNotification.js";

export default function BuyPage() {
  const address = useOutletContext();
  const [paymentData, setPaymentData] = useState({
    baseCurrencyAmount: "",
    status: "",
    walletAddress: "",
    quoteCurrency: "", //quoted crypto
    quoteCurrencyAmount: "",
    id: "",
  });
  const [transaction, setTransaction] = useState({
    coinId: "",
    userId: "",
    paymentStatus: "",
    fiatAmountUsd: "", //null
    coinAmountPurchase: "", //null
    fromAddress: "MoonPay",
    toAddresss: "",
    transactionHash: "", //null
  });
  const [renderNotification, setRenderNotification] = useState(false);

  //https://buy.moonpay.com/transaction_receipt?transactionId=45532524-1446-49f0-ab11-5eb4c9c2bd6b

  const recordPaymentConfirmation = (paymentData) => {
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      coinId: paymentData.quoteCurrency,
      paymentStatus: paymentData.status,
      fiatAmountUsd: paymentData.baseCurrencyAmount,
      coinAmountPurchase: paymentData.quoteCurrencyAmount,
      toAddresss: paymentData.walletAddress,
      transactionHash: paymentData.id,
    }));
    console.log("Transaction Received", transaction);
    executePayment(); // Assuming executePayment is a function defined elsewhere
  };

  // Add method to record transaction.

  const executePayment = async () => {
    console.log("hello", transaction.fiatAmountUsd);
    try {
      const response = await apiRequest.post(
        `/transactions/points/add/`,
        purchasePoints(
          transaction.toAddresss,
          "wBTC",
          transaction.fiatAmountUsd,
        ), // Add Payment Id
      );
      console.log("Purchase Points Received");
      setRenderNotification(true);
    } catch (err) {
      console.log(err);
    }
  };

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
            recordPaymentConfirmation(props);
          }}
        />
      </div>
      {renderNotification && (
        <PointNotification
          data={purchasePoints(address, "wBTC", transaction.fiatAmountUsd)}
          set={setRenderNotification}
        />
      )}
    </div>
  );
}
