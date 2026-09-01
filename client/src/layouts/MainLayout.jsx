import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import { ToastProvider } from '../components/common/Toast/ToastProvider';
import { useSyncUserState } from '../hooks';
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';
import Loader from '../components/common/Loader/Loader';
import { useBrandingLive, useThemeLive } from '../hooks/useCmsLive';

function LayoutInner() {
  useSyncUserState();
  useBrandingLive();
  useThemeLive();
  return (
    <div className="main-layout">
      <Navbar />
      <main className="pt-16">
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

const MainLayout = () => (
  <ToastProvider>
    <LayoutInner />
  </ToastProvider>
);

export default MainLayout;