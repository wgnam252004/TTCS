import React from 'react';
import Header from './components/layout/header';
import Footer from './components/layout/footer';
import './style.css'
import { Outlet } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;