import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './style.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainPage from './pages/mainPage';
import MoviesPage from './pages/movies';
import AboutFilmora from './pages/aboutFilmoraPage/aboutFilmoraPage';
import CinemaInfoPage from './pages/cinemaInfoAndShowTime';
import ChooseShowTime from './pages/chooseShowTime';
import ChooseSeat from './pages/chooseSeat/chooseSeat';
import PayTicket from './pages/payTicket/payTicket';
import ForgetPassword from './pages/Auth/ForgetPassword/ForgetPassword';
import ResetPassword from './pages/Auth/ResetPassword/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail/VerifyEmail';
import AuthProvider from './authProvider/authProvider';
import Register from './pages/Auth/Register/Register';
import Login from './pages/Auth/Login/Login';
import CinemaPage from './pages/cinemaPage/cinema';
import Admin from './pages/admin';
import ProfilePage from "./pages/Profile/ProfilePage";
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/movies",
        element: <MoviesPage />
      },
      {
        path: "/cinema",
        element: <CinemaPage />
      },
      {
        path: "/AboutFilmora",
        element: <AboutFilmora />
      },
      {
        path: "/cinemaDetail/:cinemaId",
        element: <CinemaInfoPage />
      },
      {
        path: "/chooseShowTimes/:id",
        element: <ChooseShowTime />
      },
      {
        path: "/bookingChair/:id",
        element: <ChooseSeat />
      },
      {
        path: "/payTicket",
        element: <PayTicket />
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute userOnly>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
    ]
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />
  },
  {
    path: "/verify-email/:token",
    element: <VerifyEmail />
  },
  {
    path: "admin",
    element: (
      <PrivateRoute adminOnly>
        <Admin />
      </PrivateRoute>
    )
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
