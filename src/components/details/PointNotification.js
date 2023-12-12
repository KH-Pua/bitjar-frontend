//-----------Libaries-----------//
import { useEffect } from "react";
import animation from "../../media/BitJar-gif.gif";

const PointNotification = ({ data }) => {
  const { actionName, pointsAllocated } = data;

  useEffect(() => {
    document.getElementById("my_modal_2").showModal();
  }, []);

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box flex flex-col items-center justify-center">
        <img src={animation} alt="logoicon" className="w-36" />
        <p className="mt-3 text-lg">{actionName}</p>
        <p className="  font-semibold">Points earned: {pointsAllocated}</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default PointNotification;
