import ethIcon from "cryptocurrency-icons/svg/color/eth.svg";
import btcIcon from "cryptocurrency-icons/svg/color/btc.svg";
import usdcIcon from "cryptocurrency-icons/svg/color/usdc.svg";

const ProductCard = ({
  id,
  title,
  description,
  onDeposit,
  onWithdraw,
  handleChange,
  amount,
  tvl,
  apy,
  currency,
}) => {
  // Function to choose the correct icon based on the currency
  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case "ETH":
        return ethIcon;
      case "BTC":
        return btcIcon;
      case "USDC":
        return usdcIcon;
      default:
        return null;
    }
  };

  const currencyIcon = getCurrencyIcon(currency);

  return (
    <div className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-400">
      {currencyIcon && (
        <img src={currencyIcon} alt={currency} className="h-6 w-6" />
      )}
      <div className="mt-8">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        <div className="mt-2">Total Value Locked: {tvl || "Loading..."}</div>
        <div>
          APY: {apy ? 
            apy === "N/A" ? 
              "N/A" :
              `${apy.toFixed(2)} %`    
            : "Loading..."}
        </div>
        <div className="mt-4">
          <input
            id={id} 
            type="text"
            value={amount}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Amount"
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={onDeposit}
              className="rounded-md bg-yellow-400 px-4 py-2 text-white hover:bg-yellow-500"
            >
              Deposit
            </button>
            <button
              onClick={onWithdraw}
              className="rounded-md bg-orange-400 px-4 py-2 text-white hover:bg-yellow-500"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
