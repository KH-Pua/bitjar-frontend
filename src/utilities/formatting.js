// Format number to currency format (e.g., 1000000000 to $1,000,000,000)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format APY from float to percentage value
const formatApyToPercent = (value) => {
  return (parseFloat(value).toFixed(4) * 100).toFixed(2);
};

// Format Ethereum value to a maximum of 4 decimal points
const formatEthValue = (value) => {
  return parseFloat(value).toFixed(4);
};

// Format to first + last 4 characters of a wallet
const formatWalletAddress = (address) => {
  return `${address.substring(0, 4)}...${address.slice(-4)}`;
};

// Format to 4/12/23, 19:25
const formatTimestamp = (currentTime) => {
  const date = new Date(currentTime);

  const options = {
    year: "2-digit",
    month: "2-digit",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formattedDateTime = new Intl.DateTimeFormat(undefined, options).format(
    date,
  );

  return formattedDateTime;
};

const formatDate = (currentTime) => {
  const date = new Date(currentTime);

  const options = {
    year: "2-digit",
    month: "short",
    day: "numeric",
  };
  const formattedDateTime = new Intl.DateTimeFormat(undefined, options).format(
    date,
  );

  return formattedDateTime;
};

const formatTimeToClaim = (time) => {
  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export {
  formatWalletAddress,
  formatTimestamp,
  formatDate,
  formatTimeToClaim,
  formatCurrency,
  formatEthValue,
  formatApyToPercent,
};
