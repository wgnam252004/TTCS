import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './style.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainPage from './pages/mainPage/mainPage'
import MovieShowtimesPage from './pages/movieShowtimesPage/movieShowtimesPage';
import TheaterShowTimes from './pages/theaterShowtimesPage/theaterShowtimesPage';
import LoginRegister from './pages/LoginRegisterPage/LoginRegisterPage';
import AboutFilmora from './pages/aboutFilmoraPage/aboutFilmoraPage';
import CinemaDetail from './pages/cinemaDetailPage/cinemaDetailPage';

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
        path: "/movieShowTimes",
        element: <MovieShowtimesPage />
      },
      {
        path: "/theaterShowTimes",
        element: <TheaterShowTimes />
      },
      {
        path: "/AboutFilmora",
        element: <AboutFilmora />
      },
      {
        path: "/cinemaDetail",
        element: <CinemaDetail />
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
