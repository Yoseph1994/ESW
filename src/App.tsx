import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import EWSLayout from '@/components/layout/EWSLayout';
import type { ActiveTab } from '@/types';

function AppLayout() {
  const { isAuthenticated, role } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Reset tab to dashboard when role changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [role]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <EWSLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showHeader={true}
      showSidebar={true}
    >
      <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
    </EWSLayout>
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
              background: '#ffffff',
              border: '1px solid #f0e6ee',
              color: '#333333',
              fontFamily: "'Times New Roman', Times, serif",
            },
          }}
        />
      </TooltipProvider>
    </AuthProvider>
  );
}
