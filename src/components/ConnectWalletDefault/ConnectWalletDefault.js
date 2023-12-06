import BITJARLOGO from "../../media/bitjar-logo.png";

export const ConnectWalletDefault = () => {
  return (
    <>
      <div className="flex h-full w-full flex-row justify-center ">
        <div className="flex h-full flex-col items-center text-center">
          <div className="pb-[3em] pt-[2em]">
            <p className="font-bold">Please Connect Wallet!</p>
            <p className="font-medium text-slate-600">
              Connect your wallet to access BitJar!
            </p>
          </div>
          <div className="translate-x-3">
            <div className="animate-bounce">
              <img src={BITJARLOGO} alt="bitjar" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
