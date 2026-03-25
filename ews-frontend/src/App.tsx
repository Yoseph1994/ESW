import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import type { ActiveTab } from '@/types';

function AppLayout() {
  const { isAuthenticated, logout, role } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Reset tab to dashboard when role changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [role]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      <Header activeTab={activeTab} onToggleSidebar={toggleSidebar} />
      <Sidebar
        collapsed={sidebarCollapsed}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileOpen(false);
        }}
        onLogout={logout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: isMobile ? 0 : sidebarCollapsed ? 72 : 280,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="pt-16 min-h-screen"
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </motion.main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <AppLayout />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 41, 0.95)',
              border: '1px solid rgba(45, 212, 191, 0.2)',
              color: '#fff',
            },
          }}
        />
      </TooltipProvider>
    </AuthProvider>
  );
}
