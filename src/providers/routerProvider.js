//-----------React-----------//
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//-----------Pages-----------//
import BaseTemplate from "../components/template/baseTemplate.js";
import HomePage from "../pages/homePage.js";
import ErrorPage from "../pages/errorPage.js";
import DashboardPage from "../pages/dashboardPage.js";
import EarnPage from "../pages/earnPage.js";
import SwapPage from "../pages/swapPage.js";
import BuyPage from "../pages/buyPage.js";
import RewardsPage from "../pages/rewardsPage.js";
import SettingsPage from "../pages/settingsPage.js";
import NotificationsPage from "../pages/notificationsPage.js";
import FaqPage from "../pages/faqPage.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
        path: "notifications",
        element: <NotificationsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "faq",
        element: <FaqPage />,
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
