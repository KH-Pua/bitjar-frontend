import { formatDate, formatWalletAddress } from "./formatting";

// ---- Sample code to add points ----//
// const addPoints = async () => {
//   try {
//     const response = await apiRequest.post(
//       `/transactions/points/add/${user.id}`,
//       dailyLoginPoints(), <---replace with message format + props if needed
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };

const dailyLoginPoints = (userAddress) => {
  const date = new Date();
  return {
    actionName: `Daily Login for ${formatDate(date)}`,
    pointsAllocated: 5,
    walletAddress: userAddress,
  };
};

const signUpPoints = (userAddress) => {
  return {
    actionName: `Sign up bonus`,
    pointsAllocated: 50,
    walletAddress: userAddress,
  };
};

const referralPoints = (userAddress, refereeAddress) => {
  return {
    actionName: `Refered new user: ${formatWalletAddress(refereeAddress)}`,
    pointsAllocated: 10,
    walletAddress: userAddress,
  };
};

const purchasePoints = (userAddress, coin, purchaseAmount) => {
  const pointsEarned = parseInt(purchaseAmount) / 10; // 1 point / $10 spent

  return {
    actionName: `Purchased $${purchaseAmount} worth of ${coin}`,
    pointsAllocated: pointsEarned,
    walletAddress: userAddress,
  };
};

const depositPoints = (userAddress, coin, product, depositAmount) => {
  const pointsEarned = depositAmount / 10; // 1 point / $10 spent

  return {
    actionName: `Deposited $${depositAmount} worth of ${coin} into ${product}`,
    pointsAllocated: pointsEarned,
    walletAddress: userAddress,
  };
};

const downlinePurchasePoints = (
  userAddress,
  purchaseAmount,
  downlineAddress,
) => {
  const pointsEarned = purchaseAmount / 100; // 0.1 point / $10 spent by downline

  return {
    actionName: `Referee (${formatWalletAddress(
      downlineAddress,
    )}) purchased crypto`, // Not including purchase amount and coin here for privacy
    pointsAllocated: pointsEarned,
    walletAddress: userAddress,
  };
};

const downlineDepositPoints = (userAddress, depositAmount, downlineAddress) => {
  const pointsEarned = depositAmount / 10; // 0.1 point / $10 spent by downline

  return {
    actionName: `Referee (${formatWalletAddress(
      downlineAddress,
    )}) deposited crypto`, // Not including deposit amount and coin here for privacy
    pointsAllocated: pointsEarned,
    walletAddress: userAddress,
  };
};

export {
  dailyLoginPoints,
  signUpPoints,
  referralPoints,
  purchasePoints,
  depositPoints,
  downlineDepositPoints,
  downlinePurchasePoints,
};
