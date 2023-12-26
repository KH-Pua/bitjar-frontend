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

export default function NotificationsPage() {
  const address = useOutletContext();

  //-----------Data-----------//
  const [notifications, setNotifications] = useState();

  // Fetch notifications from db
  const fetchNotifications = async () => {
    try {
      const response = await apiRequest.get(
        `/transactions/payments/${address}`,
      );
      setNotifications(response.data.output);
      console.log("Payment History", notifications);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (address) {
      fetchNotifications();
    }
  }, [address]);

  return (
    <>
      {address ? (
        <div>
          <header>
            <h1 className="p-0 text-3xl font-bold text-black">Notifications</h1>
          </header>
        </div>
      ) : (
        <ConnectWalletDefault />
      )}
    </>
  );
}
