import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const titlesMap = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/products': 'Product Management',
  '/admin/products/add': 'Add New Product',
  '/admin/qr-codes': 'QR Code Management',
  '/admin/orders': 'Order Management',
  '/admin/users': 'User Management',
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  let title = 'NutriHeal Admin';
  for (const [path, pageTitle] of Object.entries(titlesMap)) {
    if (location.pathname === path || location.pathname.startsWith(`${path}/`)) {
      title = pageTitle;
      break;
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9F5EC' }}>
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader
          title={title}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main style={{ flex: 1, padding: '28px 24px 60px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
