import { formatTimestamp } from "../../utilities/formatting";
import { LinkIcon } from "@heroicons/react/24/outline";

const PaymentHistoryTable = ({ data }) => {
  return (
    <div className="overflow-y-auto bg-white px-[1em]">
      {/* <table className="table"> */}
      <table className="text-left">
        {/* head */}
        <thead className="sticky top-0 z-10 mb-[1em] bg-slate-50 ">
          <tr>
            <th className="table-header">Timestamp</th>
            <th className="table-header ">Status</th>
            <th className="table-header ">Amount (USD)</th>
            <th className="table-header ">Coin</th>
            <th className="table-header pr-[1em]">Link</th>
          </tr>
        </thead>

        {/* body */}
        {data &&
          data.map((row) => (
            // Not sure why I can't put border-b-[1px]
            <tbody key={row.id} className="border-b-[1px] border-slate-300">
              <tr>
                <td className="table-data">{formatTimestamp(row.createdAt)}</td>
                <td className="table-data">{row.paymentStatus}</td>
                <td className="table-data">{row.fiatAmountUsd}</td>
                <td className="table-data">{row.coin.coinSymbol}</td>
                <td className="table-data pr-[1em]">
                  <a
                    href={`https://buy.moonpay.com/transaction_receipt?transactionId=${row.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkIcon className="h-6 w-6 text-gray-500" />
                  </a>
                </td>
              </tr>
            </tbody>
          ))}
      </table>
    </div>
  );
};

export default PaymentHistoryTable;
