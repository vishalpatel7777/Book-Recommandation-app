import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="pt-16">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;