import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';

const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Navbar is fixed, so it's here */}
      <Navbar />
      
      {/* Outlet renders the current child route (e.g., HomePage, AboutPage) */}
      {/* We add padding-top to prevent content from hiding behind the fixed navbar */}
      <main className="pt-[100px]"> {/* Adjust pt-[100px] to match your navbar's height */}
        <Outlet />
      </main>
      
      {/* Footer is at the bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout;