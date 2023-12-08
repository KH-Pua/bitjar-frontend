//-----------Libraries-----------//
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

//-----------Utilities-----------//
import { GlobalContext } from "../providers/globalProvider.js";
import BACKEND_URL from "../constants.js";

//-----------Media-----------//
import BITJARLOGO from "../../media/bitjar-logo.png";
import axios from "axios";

export default function SettingsPage() {
  const userWalletAdd = useContext(GlobalContext);
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInviteLink, setUserInviteLink] = useState("");
  const [userReferralCode, setUserReferralCode] = useState("");

  useEffect(() => {
    //Set account whenever page refreshes
    setAccount(localStorage.getItem("connection_meta"));

    //Check for web3 wallet
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    }
  },[])
  
  useEffect(() => {
    setAccount(userWalletAdd);
  }, [userWalletAdd]);

  useEffect(() => {
    if (account) {
      //Call to BE to get userName, userEmail, userInviteLink
      
      
    }
  }, [account]);

  const getUserInfo = async () => {
    try {
      const userInfo = await axios.get(`${BACKEND_URL}/userData/${account}`);
      if (userInfo) {
        setUserProfilePicture(userInfo.data.user.profilePicture);
        setUserName(userInfo.data.user.userName);
        setUserEmail(userInfo.data.user.email);
        setUserInviteLink(userInfo.data.user.referralCode);
        userReferralCode("")
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

  }

  const getRefererRefereeRelation

  const handleSubmit = async () => {
  }

  return (
    <div className="flex flex-row">
      <header>
        <h1 className="p-0 text-3xl font-bold text-black">Settings</h1>
      </header>
      <main>
        <div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <form onClick={handleSubmit}>
              <div className="px-4 py-6 sm:p-8">
                <div className="grid w-auto grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:cols-span-4">
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
                  <div className="sm:cols-span-4">
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
                  <div className="sm:cols-span-4 text-base font-semibold leading-6">
                    Referrals
                  </div>
                  <div className="sm:cols-span-4">
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
                  <div className="sm:cols-span-4">
                    <label htmlFor="username" className="text-sm font-medium leading-6">
                      Email
                    </label>
                    <input
                      id="referralcode"
                      type="text"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                      value={userReferralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                <button className="text-sm font-semibold leading-6 text-gray-900">
                  Cancel
                </button>
                <button type="submit" className=" rounded-md bg-yellow-200 px-2 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-yellow-400">
                  Submit
                </button>
              </div>
            </form>
            <div className="hidden md:block md:col-span-2">
              <img src={BITJARLOGO} alt="bitjar-logo" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
