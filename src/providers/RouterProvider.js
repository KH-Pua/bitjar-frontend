//-----------React-----------//
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//-----------Pages-----------//
import HomePage from "../pages/HomePage";
import ErrorPage from "../pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
