import { formatTimestamp } from "../../utilities/formatting";
import { LinkIcon } from "@heroicons/react/24/outline";

const PaymentHistoryTable = ({ data }) => {
  return (
    <div className="overflow-y-auto bg-white px-[1em]">
      {/* <table className="table"> */}
      <table className="text-left">
        {/* head */}
        <thead className="sticky top-0 z-10 mb-[1em] bg-slate-50">
          <tr>
            <th className="table-header pl-[1em] lg:w-[25%]">Timestamp</th>
            <th className="table-header pr-[3em]">Payment Status</th>
            <th className="table-header pr-[3em]">Purchase Amount (USD)</th>
            <th className="table-header pr-[3em]">Coin bought</th>
            <th className="table-header  pl-[1em] pr-[3em]">Amount</th>
            <th className="table-header  pl-[1em] pr-[3em]">Link</th>
          </tr>
        </thead>

        {/* body */}
        {data &&
          data.map((row) => (
            // Not sure why I can't put border-b-[1px]
            <tbody key={row.id} className="border-b-[1px] border-slate-300">
              <tr>
                <td className="py-[1em] pl-[1em]">
                  {formatTimestamp(row.createdAt)}
                </td>
                <td>{row.paymentStatus}</td>
                <td>{row.fiatAmountUsd}</td>
                <td>{row.coin.coinSymbol}</td>
                <td>{row.coinAmountPurchased}</td>
                <td>
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
