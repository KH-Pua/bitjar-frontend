//-----------React-----------//
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//-----------Pages-----------//
import BaseTemplate from "../components/template/baseTemplate.js";
import HomePage from "../pages/homePage.js";
import ErrorPage from "../pages/errorPage.js";
import OnboardingPage from "../pages/onboardingPage.js";
import DashboardPage from "../pages/dashboardPage.js";
import MarketPage from "../pages/marketPage.js";
import EarnPage from "../pages/earnPage.js";
import SwapPage from "../pages/swapPage.js";
import BuyPage from "../pages/buyPage.js";
import RewardsPage from "../pages/rewardsPage.js";
import SettingsPage from "../pages/settingsPage.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <OnboardingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <BaseTemplate />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "market",
        element: <MarketPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "earn",
        element: <EarnPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "swap",
        element: <SwapPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "buy",
        element: <BuyPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "rewards",
        element: <RewardsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
