//-----------Libraries-----------//
import { useState, useEffect } from "react";

//-----------Firebase-----------//
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase.js";

//-----------Components-----------//
import UploadImage from "../details/UploadImage.js";

//-----------Utilities-----------//
import { apiRequest } from "../../utilities/apiRequests";

//-----------Media-----------//
import bitjar from "../../media/BitJar-gif.gif";
import { formatWalletAddress } from "../../utilities/formatting.js";

const OnboardingModal = ({ address }) => {
  // Constants
  const STORAGE_KEY = "profilepic";

  const [user, setUser] = useState({
    userName: "",
    profilePicture: "",
    walletAddress: "", //Not null
    email: "",
    refererCode: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("Referral: 50 bonus pts 🔥");

  // OnMount - launch modal + input wallet address
  useEffect(() => {
    document.getElementById("onboardingModal").showModal();
    setUser({ ...user, walletAddress: address });
  }, [address]);

  // Helper Functions
  const textChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    setUser((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleImageUpload = (e) => {
    setFile(e.target.files[0]);
  };

  // Firebase: Upload image to firebase and retrieve the url
  useEffect(() => {
    if (file) {
      const fileRef = sRef(storage, `${STORAGE_KEY}/${user.walletAddress}/`);
      uploadBytes(fileRef, file)
        .then(() => getDownloadURL(fileRef))
        .then((url) => {
          setUser({ ...user, profilePicture: url });
          setFile(null);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  }, [file]);

  const handleSubmit = async (e) => {
    if (user) {
      try {
        // Edit user data
        const editUser = await apiRequest.post(`/users/editInfo`, user);
        // Check referral and add points
        try {
          if (user.refererCode) {
            await apiRequest.post("/users/referrals/add", user);
          }
        } catch (error) {
          console.error("An error occurred:", error);
          setMessage("Referral code not valid ❌");
        }

        if (editUser) {
          // Close modal on successful submission
          document.getElementById("onboardingModal").close();
        }
      } catch (err) {
        console.error("Error submit user info:", err);
      }
    }
  };

  return (
    <>
      <dialog id="onboardingModal" className="modal">
        <div className="modal-box">
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold">
              Welcome, {formatWalletAddress(address)} 👋
            </h3>
            <p className="pb-2 text-sm">Tell us more about yourself</p>
            <div
              className="tooltip tooltip-right tooltip-open"
              data-tip="Upload Picture"
            >
              <label htmlFor="profile-picture" style={{ cursor: "pointer" }}>
                <UploadImage
                  src={user.profilePicture ? user.profilePicture : bitjar}
                  alt="Profile photo"
                />
              </label>
            </div>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <input
              id="userName"
              placeholder="Username"
              type="text"
              value={user.userName}
              onChange={textChange}
              className="input m-2 border-yellow-400"
            />
            <input
              id="email"
              placeholder="Email address"
              type="email"
              autoComplete="email"
              value={user.email}
              onChange={textChange}
              className="input m-2 border-yellow-400"
            />
            <label className="text-sm">{message}</label>
            <figure>
              <input
                id="refererCode"
                placeholder="E.g. B1tJaR"
                type="text"
                value={user.refererCode}
                onChange={textChange}
                className="input mb-3 border-yellow-400"
              />
            </figure>
            <button
              onClick={handleSubmit}
              className="btn border-0 bg-yellow-200 hover:translate-y-[-2px] hover:bg-yellow-400"
            >
              Save details
            </button>
          </div>
          <div className="modal-action flex flex-row items-center">
            <p className="text-xs">
              You can update these details later on{" "}
              <span className="font-bold">Settings</span>
            </p>
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn bg-slate-200 hover:translate-x-1 hover:animate-pulse hover:bg-slate-300">
                Skip
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default OnboardingModal;
