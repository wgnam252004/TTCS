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
import TheatersPage from './pages/theatersPage/theaters';
import LoginRegister from './pages/LoginRegisterPage/LoginRegisterPage';
import AboutFilmora from './pages/aboutFilmoraPage/aboutFilmoraPage';
import CinemaInfoPage from './pages/cinemaInfo';
import ChooseShowTime from './pages/chooseShowTime';
import ChooseSeat from './pages/chooseSeat';
import PayTicket from './pages/payTicket';

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
        path: "/theaters",
        element: <TheatersPage />
      },
      {
        path: "/AboutFilmora",
        element: <AboutFilmora />
      },
      {
        path: "/cinemaDetail",
        element: <CinemaInfoPage />
      },
      {
        path: "/movieBooking",
        element: <ChooseShowTime />,
      },
      {
        path: "/bookingChair",
        element: <ChooseSeat />
      },
      {
        path: "/payTicket",
        element: <PayTicket />
      }
    ]
  },
  {
    path: "/LoginOrRegister",
    element: <LoginRegister />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
