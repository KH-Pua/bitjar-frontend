//-----------Libraries-----------//
import { useEffect, useState } from "react";

//-----------Utilities-----------//

import { apiRequest } from "../../utilities/apiRequests";
import { purchasePoints } from "../../utilities/pointsMessages.js";
import PointNotification from "../details/PointNotification.js";

const BuyTest = ({ address }) => {
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [renderNotification, setRenderNotification] = useState(false);
  const executePayment = async () => {
    console.log("hello", purchaseAmount);
    try {
      const response = await apiRequest.post(
        `/transactions/points/add/`,
        purchasePoints(address, "wBTC", purchaseAmount),
      );
      console.log("Purchase Points Received");
      setRenderNotification(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <p>testpayment</p>
      <input
        type="text"
        id="purchaseAmount"
        value={purchaseAmount}
        onChange={(e) => {
          setPurchaseAmount(e.target.value);
        }}
        placeholder="100"
      ></input>
      <button onClick={executePayment}>Confirm</button>
      {renderNotification && (
        <PointNotification
          data={purchasePoints(address, "wBTC", purchaseAmount)}
          set={setRenderNotification}
        />
      )}
    </div>
  );
};

export default BuyTest;
