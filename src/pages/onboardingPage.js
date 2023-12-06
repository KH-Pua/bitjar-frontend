//-----------Libraries-----------//
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PhotoIcon } from '@heroicons/react/24/solid'
import axios from "axios";

//-----------Utilities-----------//
import { GlobalContext } from "../providers/globalProvider.js";
import BACKEND_URL from "../constants.js";

export default function OnboardingPage() {
  const {
    userWalletAdd,
    setUserWalletAdd
  } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userReferralCode, setUserReferralCode] = useState("");

  //State for image upload
  const [file, setFile] = useState(null);
  const [fileInputInitialValue, setFileInputInitialValue] = useState("");
  const [imagePreviewURL, setImagePreviewURL] = useState("");


  const handleSubmit = async (e) => {
    console.log("enter handle submit")
    console.log(userEmail)
    console.log(userWalletAdd)
    e.preventDefault();
    if (userName && userEmail && userWalletAdd) {
      const editData = {
        walletAddress: userWalletAdd,
        email: userEmail,
        userName: userName
      }
      console.log(editData);
      try {
        const infoSubmit = await axios.post(`${BACKEND_URL}/users/editInfo`, editData);
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
    <div className="flex flex-col sm:px-60">
      <header className="p-10">
        <h1 className="text-3xl font-bold text-black">
          Welcome to BitJar,
          your one stop platform to buy, earn and swap BTC
        </h1>
      </header>
      <main className="py-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Onboarding
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Edit your personal information here
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1">
                  {/* Photo Upload */}
                  <div className="col-span-1">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Listing photo
                    </label>
                    <div className="mt-2 flex justify-center content-center text-center rounded-full w-48 h-48 border border-dashed border-gray-900/25 px-6 py-10">
                      {imagePreviewURL ? (
                        <div className="flex flex-col gap-1 text-center">
                          <div className="avatar">
                            <div className=" w-28 h-28 rounded-full">
                              <img
                                src={imagePreviewURL}
                                alt="uploadedPhoto"
                              />
                            </div>
                          </div>
                          <label
                            htmlFor="fileUpload"
                            className="text-xs relative cursor-pointer rounded-md bg-white font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-yellow-200 focus-within:ring-offset-2"
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
                        <div className="flex flex-col text-center justify-center">
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
                            {/* <p className="pl-1">or drag and drop</p> */}
                          </div>
                          {/* <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF up to 10MB
                          </p> */}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Username */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      User name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Email */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Referral Code */}
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="referralcode"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Referral Code
                    </label>
                    <div className="mt-2">
                      <input
                        id="referralcode"
                        name="referralcode"
                        type="referralcode"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-200 sm:text-sm sm:leading-6"
                        value={userReferralCode}
                        onChange={(e) => setUserReferralCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-yellow-200 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
