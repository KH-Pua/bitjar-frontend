//-----------Libraries-----------//
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

//-----------Firebase-----------//
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase.js";

//-----------Components-----------//
import { ConnectWalletDefault } from "../components/ConnectWalletDefault/ConnectWalletDefault.js";

//-----------Utilities-----------//
import { formatWalletAddress } from "../utilities/formatting.js";

//-----------Media-----------//
import bitjar from "../media/BitJar-gif.gif";
import { apiRequest, getUserData } from "../utilities/apiRequests.js";
import UploadImage from "../components/details/UploadImage.js";

export default function SettingsPage() {
  const account = useOutletContext();
  const STORAGE_KEY = "profilepic";

  // const [account, setAccount] = useState(null);
  const [user, setUser] = useState({
    userName: "",
    profilePicture: "",
    walletAddress: "", //Not null
    email: "",
    refererCode: "",
    refererWallet: "",
  });
  const [message, setMessage] = useState("");
  const [userInviteLink, setUserInviteLink] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (account) {
      //Call to BE to get userName, userEmail, userInviteLink
      getUserInfo();
      getRefererInfo();
    }
  }, [account]);

  const getUserInfo = async () => {
    try {
      const userData = await getUserData(account);
      setUser((prevUser) => ({
        ...prevUser,
        userName: userData.userName,
        profilePicture: userData.profilePicture,
        email: userData.email,
        walletAddress: account,
      }));
      setUserInviteLink(`http://bitjar.xyz/referral/${userData.referralCode}`);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Check for referer based on user wallet address
  const getRefererInfo = async () => {
    try {
      const referrerInfo = await apiRequest.post(
        `/users/getUserRefererIfAny/`,
        { walletAddress: account },
      );
      let walletAddress = referrerInfo.data.output[0].referer.walletAddress;
      setUser((prevUser) => ({ ...prevUser, refererWallet: walletAddress }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
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
    console.log("submitting", user);
    try {
      // Edit user data
      await apiRequest.post(`/users/editInfo`, user);
      setMessage("Details successfully updated ✅");

      // If user input referral code
      try {
        if (user.refererCode) {
          await apiRequest.post("/users/referrals/add", user);
          getRefererInfo();
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setMessage("Referral code not valid ❌");
      }
    } catch (err) {
      console.error("Error submit user info:", err);
      setMessage("Error updating info");
    }
  };

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

  return (
    <div>
      {account ? (
        <>
          <header>
            <h1 className="px-4 text-3xl font-bold text-black">Settings</h1>
          </header>
          <main>
            <form className="ml-4 mt-2 flex flex-col items-start ">
              {/* Photo Upload */}
              <div
                className="tooltip tooltip-right tooltip-open"
                data-tip="Update Picture"
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
              {/* Input fields section */}
              <section className="min-w-[17em]">
                <div className="mt-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium leading-6"
                  >
                    Username
                  </label>
                  <input
                    id="userName"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                    value={user.userName}
                    onChange={textChange}
                  />
                </div>
                <div className="mt-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium leading-6"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                    value={user.email}
                    onChange={textChange}
                  />
                </div>
                <div className="mt-2 font-semibold">Referrals</div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium leading-6"
                  >
                    Your invite link
                  </label>
                  <input
                    id="invitelink"
                    type="text"
                    disabled
                    className="block w-full rounded-md border-0 bg-yellow-200 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                    value={userInviteLink}
                  />
                </div>

                {user.refererWallet ? (
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium leading-6"
                    >
                      Referral code
                    </label>
                    <input
                      id="referralcode"
                      type="text"
                      disabled
                      className="block w-full rounded-md border-0 bg-gray-200 py-1.5 text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                      value={`Invited by: ${formatWalletAddress(
                        user.refererWallet,
                      )} ✅`}
                    />
                  </div>
                ) : (
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium leading-6"
                    >
                      Referral code
                    </label>
                    <input
                      id="refererCode"
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                      value={user.refererCode}
                      onChange={textChange}
                    />
                  </div>
                )}
              </section>

              <p className="my-2 text-sm">{message}</p>
            </form>
            <button
              onClick={handleSubmit}
              className="btn ml-4 border-0 bg-yellow-200 hover:translate-y-[-2px] hover:bg-yellow-400"
            >
              Save details
            </button>
          </main>
        </>
      ) : (
        <ConnectWalletDefault />
      )}
    </div>
  );
}
