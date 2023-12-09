//-----------Libraries-----------//
import { useState, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { PhotoIcon } from '@heroicons/react/24/solid'
import axios from "axios";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

//-----------Utilities-----------//
import { GlobalContext } from "../providers/globalProvider.js";
import BACKEND_URL from "../constants.js";
import { storage } from "../firebase/firebase.js";
import { referralPoints } from "../utilities/pointsMessages.js"

//-----------Media-----------//
import BITJARLOGO from "../media/bitjar-logo.png";

//-----------Components-----------//
import { ConnectWalletDefault } from "../components/ConnectWalletDefault/ConnectWalletDefault.js";

export default function SettingsPage() {
  const walletAdd = useOutletContext();
  const {setUserProfilePicture} = useContext(GlobalContext);
  const navigate = useNavigate();
  const STORAGE_KEY = "profilepic"

  const [account, setAccount] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInviteLink, setUserInviteLink] = useState("");
  const [userReferralCode, setUserReferralCode] = useState("");
  const [userReferralCodeInputOnPage, setUserReferralCodeInputOnPage] = useState("");

  //State for image upload
  const [file, setFile] = useState(null);
  const [fileInputInitialValue, setFileInputInitialValue] = useState("");
  const [imagePreviewURL, setImagePreviewURL] = useState("");

  useEffect(() => {
    //Set account whenever page refreshes
    setAccount(localStorage.getItem("connection_meta"));
  },[])
  
  useEffect(() => {
    setAccount(walletAdd);
  }, [walletAdd]);

  useEffect(() => {
    if (account) {
      //Call to BE to get userName, userEmail, userInviteLink
      getUserInfo();
      getRefererInfo();
    }
  }, [account]);

  const getUserInfo = async () => {
    try {
      console.log(account)
      const userInfo = await axios.get(`${BACKEND_URL}/users/userData/${account}`);
      if (userInfo) {
        setImagePreviewURL(userInfo.data.user.profilePicture);
        setUserName(userInfo.data.user.userName);
        setUserEmail(userInfo.data.user.email);
        setUserInviteLink(`http://bitjar.xyz/referral/${userInfo.data.user.referralCode}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    };
  }

  const getRefererInfo = async () => {
    //Check whether the referrer is exist
    try {
      console.log(account)
      const referrerInfo = await axios.post(`${BACKEND_URL}/users/getUserRefererIfAny/`, {walletAddress: account});
      if (referrerInfo) {
        setUserReferralCode(referrerInfo.data.output.referralCode);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userName && userEmail) {
      let imageURL
      if (file) {
        // Verified the id of the created listing, then upload photo to Firebase
        try {
            const fileRef = sRef(
              storage,
              `${STORAGE_KEY}/${account}/`
            );

            await uploadBytes(fileRef, file);
            imageURL = await getDownloadURL(fileRef);
  
        } catch (error) {
          console.error("Error handling photo upload:", error);
        }
      } else {
        imageURL = imagePreviewURL
      }

      //Set image to global provider state to update the picture on base template
      setUserProfilePicture(imageURL);

      const editData = {
        walletAddress: account,
        email: userEmail,
        userName: userName,
        profilePicture: imageURL,
      }

      // update BE with inserted data
      try {
        // Edit user data
        const infoSubmit = await axios.post(`${BACKEND_URL}/users/editInfo`, editData);

        // If user input referral code
        if (userReferralCodeInputOnPage) {
          // Request referer wallet address
          const queryReferrerUser = await axios.post(`${BACKEND_URL}/users/getUserDataViaReferralCode`, {referralCode: userReferralCodeInputOnPage});
          // Record transactions on referral
          const recordTransaction = await axios.post(`${BACKEND_URL}/transactions/points/add/`, referralPoints(queryReferrerUser.data.output.walletAddress, account));
          // Update referral table
          const recordReferral = await axios.post(`${BACKEND_URL}/users/recordReferrerAndReferree/`, {walletAddress: account, referralCode: userReferralCodeInputOnPage});
        }

        if (infoSubmit) {
          console.log(infoSubmit);
          navigate("/dashboard");

        }
      } catch (err) {
        console.error("Error submit user info:", err);
      }
    };
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImagePreviewURL(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="flex flex-col">
      {account ? (
        <>
          <header>
            <h1 className="px-4 text-3xl font-bold text-black">Settings</h1>
          </header>
          <main>
            <div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 xl:grid-cols-3 ">
                <form onSubmit={handleSubmit}>
                  <div className="px-4 py-6 sm:p-4">
                    <div className="grid max-w-2xl grid-cols-1 gap-y-8">
                      {/* Photo Upload */}
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="cover-photo"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Profile Photo
                        </label>
                        <div className="mt-4 flex h-48 w-48 content-center justify-center rounded-full border border-dashed border-gray-900/25 px-6 py-10 text-center">
                          {imagePreviewURL ? (
                            <div className="flex flex-col gap-1 text-center">
                              <div className="avatar">
                                <div className=" h-28 w-28 rounded-full">
                                  <img src={imagePreviewURL} alt="uploadedPhoto" />
                                </div>
                              </div>
                              <label
                                htmlFor="fileUpload"
                                className="relative cursor-pointer rounded-md bg-white text-xs font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-yellow-200 focus-within:ring-offset-2"
                              >
                                <span>Change Photo</span>
                                <input
                                  id="fileUpload"
                                  name="fileUpload"
                                  type="file"
                                  className="sr-only"
                                  onChange={(e) => handleFileChange(e)}
                                />
                              </label>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-center text-center">
                              <PhotoIcon
                                className="mx-auto h-12 w-12 text-gray-300"
                                aria-hidden="true"
                              />
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                  htmlFor="fileUpload"
                                  className="relative cursor-pointer rounded-md bg-white font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-yellow-200 focus-within:ring-offset-2"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="fileUpload"
                                    name="fileUpload"
                                    type="file"
                                    className="sr-only"
                                    value={fileInputInitialValue}
                                    onChange={(e) => handleFileChange(e)}
                                  />
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {userName && (
                        <div className="sm:col-span-4">
                          <label htmlFor="username" className="text-sm font-medium leading-6">
                            Username
                          </label>
                          <input
                            id="username"
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                        </div>
                      )}
                      {userEmail && (
                        <div className="sm:col-span-4">
                          <label htmlFor="username" className="text-sm font-medium leading-6">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                          />
                        </div>
                      )}

                      {userInviteLink && (
                        <>
                          <div className="sm:col-span-4 text-base font-semibold leading-6">
                          Referrals
                          </div>
                          <div className="sm:col-span-4">
                            <label htmlFor="username" className="text-sm font-medium leading-6">
                              Your invite link
                            </label>
                            <input
                              id="invitelink"
                              type="text"
                              disabled
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-yellow-200 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                              value={userInviteLink}
                            />
                          </div>
                        </>
                      )}
                      {userReferralCode ? (
                        <div className="sm:col-span-4">
                          <label htmlFor="username" className="text-sm font-medium leading-6">
                            Referral Code
                          </label>
                          <input
                            id="referralcode"
                            type="text"
                            disabled
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset bg-gray-200 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                            value={userReferralCode}
                          />
                        </div>
                      ) : (
                        <div className="sm:col-span-4">
                          <label htmlFor="username" className="text-sm font-medium leading-6">
                            Referral Code
                          </label>
                          <input
                            id="referralcode"
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                            value={userReferralCodeInputOnPage}
                            onChange={(e) => setUserReferralCodeInputOnPage(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <button type="submit" className="rounded-md bg-yellow-200 px-2 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-yellow-400">
                      Submit
                    </button>
                  </div>
                </form>
                <div className="hidden md:block md:col-span-1 xl:col-span-2">
                  <img src={BITJARLOGO} alt="bitjar-logo" />
                </div>
              </div>
            </div>
          </main>
        </>
      ) : 
      <ConnectWalletDefault />
      }
    </div>
  );
}
