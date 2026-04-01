/**
 * EWSLayout — Modular layout wrapper for the Early Warning System.
 *
 * When running standalone, this renders the full Header + Sidebar + Content.
 * When embedded inside the Wholesale Origination system, the parent can hide
 * the header/sidebar via props and only render the content area.
 *
 * Usage (standalone):
 *   <EWSLayout>
 *     <Dashboard />
 *   </EWSLayout>
 *
 * Usage (embedded in Wholesale):
 *   <EWSLayout showHeader={false} showSidebar={false}>
 *     <Dashboard />
 *   </EWSLayout>
 */

import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import type { ActiveTab } from '@/types';

interface EWSLayoutProps {
  children: ReactNode;
  /** Show the EWS header bar. Set false when embedded in a parent layout. */
  showHeader?: boolean;
  /** Show the EWS sidebar. Set false when embedded in a parent layout. */
  showSidebar?: boolean;
  /** Currently active navigation tab */
  activeTab: ActiveTab;
  /** Callback when navigation tab changes */
  onTabChange: (tab: ActiveTab) => void;
  /** Extra className for the outer wrapper */
  className?: string;
}

export default function EWSLayout({
  children,
  showHeader = true,
  showSidebar = true,
  activeTab,
  onTabChange,
  className = '',
}: EWSLayoutProps) {
  const { logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // When embedded (no header/sidebar), just render the content
  if (!showHeader && !showSidebar) {
    return (
      <div className={`ews-embedded-root ${className}`} style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        {children}
      </div>
    );
  }

  const contentMarginLeft = !showSidebar
    ? 0
    : isMobile
      ? 0
      : sidebarCollapsed
        ? 72
        : 260;

  return (
    <div className={`min-h-screen bg-[#f5f5f5] ${className}`} style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {showHeader && (
        <Header activeTab={activeTab} onToggleSidebar={toggleSidebar} />
      )}

      {showSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          activeTab={activeTab}
          onTabChange={(tab) => {
            onTabChange(tab);
            setMobileOpen(false);
          }}
          onLogout={logout}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      )}

      <motion.main
        initial={false}
        animate={{ marginLeft: contentMarginLeft }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={showHeader ? 'pt-16 min-h-screen' : 'min-h-screen'}
      >
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
