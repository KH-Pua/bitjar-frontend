const ProgressBar = ({ progress, currentPoints, nextTier }) => {
  return (
    <div>
      <header className="flex flex-row justify-between">
        <h1>Total Points Earned: {currentPoints}</h1>
        <button
          className="animate-pulse text-xs hover:font-semibold"
          onClick={() =>
            document.getElementById("points_info_modal").showModal()
          }
        >
          How to earn points?
        </button>
        <dialog id="points_info_modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-bold">Earning Points:</h3>
            <p className="py-4">Earn points by doing x x x </p>
          </div>
        </dialog>
      </header>
      <div className="h-4 w-full rounded-full bg-gray-600">
        <div
          className="h-full rounded-full bg-green-500"
          style={{ width: `${progress}` }}
        ></div>
      </div>
      <p>Earn {nextTier} more points to unlock airdrops</p>
    </div>
  );
};

export default ProgressBar;
