//-----------Libraries-----------//
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { MoonPayBuyWidget } from "@moonpay/moonpay-react";

//-----------Components-----------//
import PaymentHistoryTable from "../components/buy/PaymentHistoryTable.js";

//-----------Utilities-----------//
import { apiRequest } from "../utilities/apiRequests";
import { purchasePoints } from "../utilities/pointsMessages.js";
import PointNotification from "../components/details/PointNotification.js";

export default function BuyPage() {
  const address = useOutletContext();
  const [transaction, setTransaction] = useState({
    coinName: "", // To be converted into coinId by backend
    paymentStatus: "",
    fiatAmountUsd: "", //null
    coinAmountPurchased: "", //null
    fromAddress: "",
    toAddress: "",
    transactionHash: "", //null
    actionName: "", // For points
    pointsAllocated: "", // For points
  });
  const [paymentData, setPaymentData] = useState();

  const [renderNotification, setRenderNotification] = useState(false);

  //https://buy.moonpay.com/transaction_receipt?transactionId=45532524-1446-49f0-ab11-5eb4c9c2bd6b

  // Data transformation from Moonpay props -> db columns
  const recordPaymentConfirmation = (paymentData) => {
    const pointsEarned = parseInt(paymentData.baseCurrencyAmount) / 10; // 1 point / $10 spent

    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      coinName: paymentData.quoteCurrency.name,
      paymentStatus: paymentData.status,
      fiatAmountUsd: paymentData.baseCurrencyAmount,
      coinAmountPurchased: paymentData.quoteCurrencyAmount,
      fromAddress: "MoonPay",
      toAddress: paymentData.walletAddress,
      transactionHash: paymentData.id,
      actionName: `Purchased $${paymentData.baseCurrencyAmount} worth of ${paymentData.quoteCurrency.name}`,
      pointsAllocated: pointsEarned,
    }));
  };

  // Execute payments once onTransactionComplete received
  useEffect(() => {
    if (transaction.transactionHash) {
      executePayment();
    }
  }, [transaction]);

  // Record Transaction
  const executePayment = async () => {
    console.log("Transaction Executing", transaction);
    try {
      const response = await apiRequest.post(
        `/transactions/payments/add/`,
        transaction,
      );
      console.log("Transaction confirmed");
      setRenderNotification(true);
      fetchPaymentsHistory();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPaymentsHistory = async () => {
    try {
      const response = await apiRequest.get(
        `/transactions/payments/${address}`,
      );
      setPaymentData(response.data.output);
      console.log("Payemtn History", paymentData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (address) {
      fetchPaymentsHistory();
    }
  }, [address]);

  return (
    <div className="flex flex-col">
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
      <figure className="flex h-[500px] flex-col items-center">
        <h2 className="pb-[.5em] text-[1.5rem] font-semibold">
          Payment History
        </h2>
        <PaymentHistoryTable data={paymentData} />
      </figure>
      {renderNotification && (
        <PointNotification
          data={purchasePoints(
            address,
            transaction.coinName,
            transaction.fiatAmountUsd,
          )}
        />
      )}
    </div>
  );
}
