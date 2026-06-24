import Home from "../Pages/Home";
import Signin from "../Pages/SignIn";
import Signup from "../Pages/SignUp";
import Dashboard from "../Pages/Dashboard";
import ErrorPage from "../Pages/ErrorPage";
import SharedBrain from "../Pages/Brain";

export const RoutesConfig = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  { path: "/brain/:hash", element: <SharedBrain /> },
  {
    path: "*",
    element: <ErrorPage />,
  },
];
