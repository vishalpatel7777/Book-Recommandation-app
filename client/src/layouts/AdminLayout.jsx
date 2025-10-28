import React from 'react';
import { Outlet } from 'react-router-dom';
// We assume you will create/move AdminNav.jsx to this path as per your plan
import AdminNav from '../components/admin/AdminNav'; 

const AdminLayout = () => {
  return (
    <div className="admin-layout flex"> {/* Using flex for a common sidebar layout */}
      <AdminNav />
      
      {/* Outlet renders the current admin child route (e.g., AdminDashboard, AdminProfile) */}
      <main className="flex-1 p-6"> {/* Add padding and allow it to grow */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;