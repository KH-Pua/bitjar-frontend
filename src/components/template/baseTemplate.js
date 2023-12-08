//-----------Libraries-----------//
import { useState, useEffect, useContext, Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";

//-----------Utilities-----------//
import { formatWalletAddress } from "../../utilities/formatting";
import { GlobalContext } from "../../providers/globalProvider.js";
import BACKEND_URL from "../../constants.js";
import { getUserData } from "../../utilities/apiRequests";
import { signUpPoints } from "../../utilities/pointsMessages.js";

//-----------Media-----------//
import {
  Bars3Icon,
  BellIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon,
  TrophyIcon,
  BanknotesIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import logo from "../../media/bitjar-logo.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

let web3;

export default function BaseTemplate() {
  const {
    userProfilePicture,
    setUserProfilePicture,
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarNavigation, setSidebarNavigation] = useState("");
  const [dropdownNavigation, setDropdownNavigation] = useState("");
  const [template, setTemplate] = useState("");
  const [pathName, setPathName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [account, setAccount] = useState("");
  const [verifyNewUserBool, setVerifyNewUserBool] = useState("");

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      console.log("these are the accounts: ", accounts);
      setAccount(accounts[0]);
      localStorage.setItem("connection_meta", accounts[0]);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    localStorage.removeItem("connection_meta");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: false },
    { name: "Earn", href: "/earn", icon: CurrencyDollarIcon, current: false },
    { name: "Swap", href: "/swap", icon: ArrowsRightLeftIcon, current: false },
    { name: "Buy", href: "/buy", icon: BanknotesIcon, current: false },
    { name: "Rewards", href: "/rewards", icon: TrophyIcon, current: false },
  ];

  const userNavigation = [
    { name: "Switch wallet", onclick: "" }, // Switch wallet function to be added
    { name: "Disconnect", onclick: disconnectWallet },
  ];

  // Set current to true if route matches nav
  const selectedPageButtonHandler = (array, route) => {
    return array.map((navObj) => {
      if (navObj.href === route) {
        navObj.current = true;
      }
      return navObj;
    });
  };

  // Verify user info. If is new user redirect to onbording, else re-render sidebarWithHeader.
  const verifyUserInfo = async () => {
    try {
      let userInfo = await axios.post(`${BACKEND_URL}/users/getInfoViaWalletAdd`, {walletAddress: account});
      setUserProfilePicture(userInfo.data.output.dataValues.profilePicture)
      // New user verification boolean
      setVerifyNewUserBool(userInfo.data.output.newUser)
    } catch (err) {
      console.error("Error verify user info:", err);
    };
  };

  useEffect(() => {
    // Wallet ID whenever page refreshes
    setAccount(localStorage.getItem("connection_meta"));
    verifyUserInfo();

    //Check for web3 wallet
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
    }

    //Handles button selection on the sidebar
    let route = location.pathname;
    let updatedNav = selectedPageButtonHandler(navigation, route);
    setSidebarNavigation(updatedNav);
    setDropdownNavigation(userNavigation);
  }, []);

  useEffect(() => {
    // Check current path name and set sidebar navigation button
    if (pathName) {
      let updatedNav = selectedPageButtonHandler(navigation, pathName);
      setSidebarNavigation(updatedNav);
    }
  }, [pathName]);

  useEffect(() => {
    // Variables to re-render sidebar/header
    renderSideBarWithHeader();
  }, [
    sidebarNavigation,
    dropdownNavigation,
    sidebarOpen,
    account,
    userProfilePicture,
  ]);


  // Verify user info. If is new user redirect to onbording, else re-render sidebarWithHeader.
  const verifyUserInfo = async () => {
    try {
      let userInfo = await axios.post(
        `${BACKEND_URL}/users/getInfoViaWalletAdd`,
        { walletAddress: account },
      );
      console.log(userInfo);
      //Set wallet address & profile picture to global state for passing around.
      setUserWalletAdd(userInfo.data.output.dataValues.walletAddress);
      setUserProfilePicture(userInfo.data.output.dataValues.profilePicture);
      // New user verification boolean
      setVerifyNewUserBool(userInfo.data.output.newUser);
    } catch (err) {
      console.error("Error verify user info:", err);
    }
  };

  useEffect(() => {
    if (account) {
      verifyUserInfo();
    }
  }, [account]);

  useEffect(() => {
    async function recordSignupTransaction() {
      try {
        await axios.post(
          `${BACKEND_URL}/transactions/points/add/`,
          signUpPoints(account),
        );
      } catch (err) {
        console.log(err);
      }
    }

    if (verifyNewUserBool) {
      console.log("new user created, redirect to onboarding page")
      recordSignupTransaction();
      navigate("/onboarding");
    } else {
      console.log("Existing user");
      renderSideBarWithHeader();
    }
  },[verifyNewUserBool])


  const renderSideBarWithHeader = () => {
    if (sidebarNavigation && dropdownNavigation) {
      setTemplate(
        <>
          <div>
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-50 lg:hidden"
                onClose={setSidebarOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-900/80" />
                </Transition.Child>

                <div className="fixed inset-0 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-200 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-200 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                          <button
                            type="button"
                            className="-m-2.5 p-2.5"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon
                              className="h-6 w-6 text-white"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                        <NavLink
                          to="/"
                          className="flex h-16 shrink-0 items-center"
                        >
                          <img src={logo} alt="BitJar Logo" className="h-16" />
                          <h1 className="translate-y-2 text-[36px] font-semibold tracking-tight">
                            Bitjar
                          </h1>
                        </NavLink>
                        <nav className="flex flex-1 flex-col">
                          <ul className="flex flex-1 flex-col gap-y-7">
                            <li>
                              <ul className="-mx-2 space-y-1">
                                {sidebarNavigation.map((item) => (
                                  <li key={item.name}>
                                    <NavLink
                                      to={item.href}
                                      onClick={() => {
                                        setSidebarOpen(false);
                                        setPathName(item.href);
                                      }}
                                      className={classNames(
                                        item.current
                                          ? " bg-yellow-200 text-gray-900"
                                          : "text-gray-700 hover:bg-yellow-200",
                                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                      )}
                                    >
                                      <item.icon
                                        className={classNames(
                                          item.current
                                            ? "text-gray-900"
                                            : "text-gray-400",
                                          "h-6 w-6 shrink-0",
                                        )}
                                        aria-hidden="true"
                                      />
                                      {item.name}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </li>
                            <li className="mt-auto">
                              <NavLink
                                to="/settings"
                                onClick={() => {
                                  setSidebarOpen(false);
                                  setPathName("/settings");
                                }}
                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-yellow-200"
                              >
                                <Cog6ToothIcon
                                  className="h-6 w-6 shrink-0 text-gray-400"
                                  aria-hidden="true"
                                />
                                Settings
                              </NavLink>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
              <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                <NavLink to="/" className="flex h-16 shrink-0 items-center">
                  <img src={logo} alt="BitJar Logo" className="h-16" />
                  <h1 className="translate-y-2 text-[36px] font-semibold tracking-tight">
                    Bitjar
                  </h1>
                </NavLink>
                <nav className="flex flex-1 flex-col">
                  <ul className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul className="-mx-2 space-y-1">
                        {sidebarNavigation.map((item) => (
                          <li key={item.name}>
                            <NavLink
                              to={item.href}
                              onClick={() => setPathName(item.href)}
                              className={classNames(
                                item.current
                                  ? " bg-yellow-200 text-gray-900"
                                  : "text-gray-700 hover:bg-yellow-200",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? "text-gray-900"
                                    : "text-gray-400",
                                  "h-6 w-6 shrink-0",
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <NavLink
                        to="/settings"
                        onClick={() => {
                          setSidebarOpen(false);
                          setPathName("/settings");
                        }}
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-yellow-200"
                      >
                        <Cog6ToothIcon
                          className="h-6 w-6 shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        Settings
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

            <div className="lg:pl-72">
              <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div
                  className="h-6 w-px bg-gray-200 lg:hidden"
                  aria-hidden="true"
                />

                <div className="flex flex-1 flex-row-reverse gap-x-4 self-stretch lg:gap-x-6">
                  {/* <form
                    className="relative flex flex-1"
                    action="#"
                    method="GET"
                  >
                    <label htmlFor="search-field" className="sr-only">
                      Search
                    </label>
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      id="search-field"
                      className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      type="search"
                      name="search"
                    />
                  </form> */}
                  <div className="flex items-center gap-x-4 lg:gap-x-6">
                    {/* <button
                      type="button"
                      className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}

                    {/* Separator */}
                    {/* <div
                      className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                      aria-hidden="true"
                    /> */}

                    {/* Profile dropdown */}
                    {!account ? (
                      <Menu as="div" className="relative">
                        <Menu.Button
                          className="btn btn-ghost no-animation flex items-center bg-yellow-200 p-1.5 marker:-m-1.5 hover:bg-yellow-300"
                          onClick={connectWallet}
                        >
                          <span className="sr-only">Connect wallet</span>
                          <span className="lg:hidden lg:items-center">
                            <span
                              className=" mx-4 text-sm font-semibold leading-6 text-gray-900"
                              aria-hidden="true"
                            >
                              Connect
                            </span>
                          </span>
                          <span className="hidden lg:flex lg:items-center">
                            <span
                              className=" mx-4 text-sm font-semibold leading-6 text-gray-900"
                              aria-hidden="true"
                            >
                              Connect Wallet
                            </span>
                          </span>
                        </Menu.Button>
                      </Menu>
                    ) : (
                      <Menu as="div" className="relative">
                        <Menu.Button className="btn btn-ghost no-animation -m-1.5 flex items-center bg-slate-100 p-1.5 hover:bg-yellow-200">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full bg-gray-50"
                            src={userProfilePicture ? userProfilePicture : ""}
                            alt="img"
                          />
                          <span className="hidden lg:flex lg:items-center">
                            <span
                              className="text-sm font-semibold leading-6 text-gray-900"
                              aria-hidden="true"
                            >
                              {formatWalletAddress(account)}
                            </span>
                            <ChevronDownIcon
                              className="ml-2 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            {dropdownNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <button
                                    //to={item.href}
                                    onClick={item.onclick}
                                    className={classNames(
                                      active ? "bg-gray-50" : "",
                                      "block px-3 py-1 text-sm leading-6 text-gray-900",
                                    )}
                                  >
                                    {item.name}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                  </div>
                </div>
              </div>

              <main className="py-10">
                <div className="px-4 sm:px-6 lg:px-8">
                  <Outlet context={account} />
                </div>
              </main>
            </div>
          </div>
        </>,
      );
    }
  };

  return <>{template}</>;
}
