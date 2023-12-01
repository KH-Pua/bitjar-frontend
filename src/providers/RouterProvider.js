//-----------React-----------//
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//-----------Pages-----------//
import HomePage from "../pages/HomePage";
import OnboardingPage from "../pages/OnboardingPage.js";
import DashboardPage from "../pages/DashboardPage.js";
import BuyPage from "../pages/BuyPage";
import EarnPage from "../pages/EarnPage";
import MarketPage from "../pages/MarketPage";
import SettingsPage from "../pages/SettingsPage";
import SwapPage from "../pages/SwapPage";
import RewardsPage from "../pages/RewardsPage.js";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/onboarding",
    element: <DashboardPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/market",
    element: <MarketPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/earn",
    element: <EarnPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/swap",
    element: <SwapPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/buy",
    element: <BuyPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/rewards",
    element: <RewardsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    errorElement: <ErrorPage />,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
