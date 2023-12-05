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

export { formatWalletAddress, formatTimestamp, formatDate };
