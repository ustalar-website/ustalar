import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/register";
import Login from "../pages/login";
import Ecom from "../pages/Ecom";
import Home from "../home/All";
import ReviewPage from "../pages/ReviewPage";
import ProfilePage from "../profil";
import Rey from "../pages/rey";
import Edit from "../components/Edit";
import Review from "../components/review";
import ChangePassword from "../components/ChangePassword";
import MainPage from "../components/MainPage";
import ReviewForm from "../components/review-form";
import React from "react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/ecom",
    element: <Ecom />,
  },
  {
    path: "/reviews/:masterId",
    element: <ReviewPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profil/",
    element: <ProfilePage />,
  },
  {
    path: "/rey",
    element: <Rey />,
  },

  //! bu profile hissesindeki review-dur
  {
    path: "/review/:masterId",
    element: <Review />,
  },
  {
    path: "/edit",
    element: <Edit />,
  },
  {
    path: "/reset",
    element: <ChangePassword />,
  },
  {
    path: "/master/:masterId",
    element: <MainPage />,
  },

  {
    path: "/master/:masterId/reviews",
    element: <ReviewForm />,
  },
]);
