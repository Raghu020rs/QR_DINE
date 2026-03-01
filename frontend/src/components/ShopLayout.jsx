import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { Home, Building2, BookOpen, QrCode, X, Menu, LogOut } from 'lucide-react';

const ShopLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userName = localStorage.getItem('userName') || 'Shop Admin';
  const shopId = localStorage.getItem('shopId');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login/shop');
  };

  const menuItems = [
    { 
      path: '/shop/dashboard', 
      icon: <Home className="w-5 h-5" />,
      label: 'Dashboard' 
    },
    { 
      path: '/shop/profile', 
      icon: <Building2 className="w-5 h-5" />,
      label: 'Shop Profile' 
    },
    { 
      path: '/shop/menu', 
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Menu Items' 
    },
    { 
      path: '/shop/qr-code', 
      icon: <QrCode className="w-5 h-5" />,
      label: 'QR Code' 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Shop Admin</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center transform hover:rotate-12 transition-transform duration-300 shadow-lg">
                <Building2 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">QR Menu</h2>
                <p className="text-xs text-muted-foreground">Shop Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 hover:translate-x-1 group ${
                    isActive ? 'bg-sidebar-accent border-l-4 border-green-500' : ''
                  }`
                }
              >
                <span className="transform group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sidebar-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground">Shop Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all duration-200 font-medium flex items-center justify-center gap-2 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ShopLayout;
