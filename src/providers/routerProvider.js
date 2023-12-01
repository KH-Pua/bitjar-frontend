//-----------React-----------//
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//-----------Pages-----------//
import HomePage from "../pages/homePage.js";
import ErrorPage from "../pages/errorPage.js";
import BaseTemplate from "../components/template/baseTemplate.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <OnBoardingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "",
    element: <BaseTemplate />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/market",
        element: <Market />,
        errorElement: <ErrorPage />,
      },
    ]
  },





]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
