//-----------Libraries-----------//
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { MoonPayBuyWidget } from "@moonpay/moonpay-react";

//-----------Components-----------//
import PaymentHistoryTable from "../components/buy/PaymentHistoryTable.js";
import PointNotification from "../components/details/PointNotification.js";
import { ConnectWalletDefault } from "../components/ConnectWalletDefault/ConnectWalletDefault.js";

//-----------Utilities-----------//
import { apiRequest } from "../utilities/apiRequests";
import { purchasePoints } from "../utilities/pointsMessages.js";

export default function BuyPage() {
  const address = useOutletContext();

  //-----------Data-----------//
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

  //-----------State Toggles-----------//
  const [renderNotification, setRenderNotification] = useState(false);

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
      console.log("Payment History", paymentData);
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
    <>
      {address ? (
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-black">Buy</h1>
          <div className="flex flex-col items-center justify-center">
            <p className="translate-y-3">
              {" "}
              Crypto purchases powered by
              <a
                href="https://www.moonpay.com/"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-purple-800"
              >
                {" "}
                MoonPay 🌙
              </a>
            </p>
            <MoonPayBuyWidget
              variant="embedded"
              baseCurrencyCode="usd"
              baseCurrencyAmount="100"
              defaultCurrencyCode="eth"
              walletAddress={address}
              colorCode="#face5e"
              onTransactionCompleted={(props) => {
                console.log("tx complete", props);
                recordPaymentConfirmation(props);
              }}
            />
          </div>
          <h1 className="pt-12 text-base font-semibold leading-6 text-gray-900">
            Payments
          </h1>
          <p className="my-2 text-sm text-gray-700">
            List of past 5 purchases ordered by timestamp
          </p>
          <figure className="flex h-[500px] flex-col items-center">
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
      ) : (
        <ConnectWalletDefault />
      )}
    </>
  );
}
