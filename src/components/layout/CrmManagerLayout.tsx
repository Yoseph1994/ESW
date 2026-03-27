/**
 * CRM Manager Layout
 * Protected layout wrapper that renders CRM Manager sidebar, header, and main content area.
 * Routes content based on active CRM tab.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import CrmManagerHeader from '@/components/layout/CrmManagerHeader';
import CrmManagerSidebar from '@/components/layout/CrmManagerSidebar';
import CrmManagerDashboard from '@/components/crm-manager/CrmManagerDashboard';
import NewCasesContent from '@/components/crm-manager/NewCasesContent';
import CompletedCasesContent from '@/components/crm-manager/CompletedCasesContent';
import type { CrmActiveTab } from '@/types';
import { AnimatePresence } from 'framer-motion';

export default function CrmManagerLayout() {
  const { logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CrmActiveTab>('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      <CrmManagerHeader activeTab={activeTab} onToggleSidebar={toggleSidebar} />
      <CrmManagerSidebar
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && (
                <CrmManagerDashboard onTabChange={setActiveTab} />
              )}
              {activeTab === 'newCases' && <NewCasesContent />}
              {activeTab === 'completedCases' && <CompletedCasesContent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
