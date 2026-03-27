/**
 * CRM Manager Sidebar
 * Mirrors the Admin Sidebar design exactly, with CRM Manager-specific nav items:
 * Dashboard, New Cases, Complete Case, Logout
 */
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  CheckCircle2,
  LogOut,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import type { CrmActiveTab } from '@/types';

interface CrmManagerSidebarProps {
  collapsed: boolean;
  activeTab: CrmActiveTab;
  onTabChange: (tab: CrmActiveTab) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/** Navigation items for the CRM Manager sidebar */
const NAV_ITEMS: { id: CrmActiveTab | 'logout'; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'newCases', label: 'New Cases', icon: FolderOpen },
  { id: 'completedCases', label: 'Complete Case', icon: CheckCircle2 },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

function SidebarContent({
  collapsed,
  activeTab,
  onTabChange,
  onLogout,
}: Omit<CrmManagerSidebarProps, 'mobileOpen' | 'onMobileClose'>) {
  const { userName, role } = useAuth();
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleClick = (id: CrmActiveTab | 'logout') => {
    if (id === 'logout') {
      onLogout();
    } else {
      onTabChange(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo + User */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 min-w-[2.5rem] rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h2 className="text-lg font-bold text-white">EWS</h2>
                <p className="text-[11px] text-teal-400/70">Early Warning System</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <Avatar className="h-10 w-10 border-2 border-teal-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-700 text-white text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">
                    {userName}
                  </p>
                  <p className="text-[11px] text-teal-400">{role}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-white/5 mx-4" />

      {/* Nav Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id !== 'logout' && activeTab === item.id;
            const isLogout = item.id === 'logout';
            const Icon = item.icon;

            const btn = (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleClick(item.id)}
                className={`
                  w-full justify-start gap-3 h-11 relative group transition-all duration-200
                  ${collapsed ? 'px-3 justify-center' : 'px-4'}
                  ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300'
                      : isLogout
                      ? 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="crmActiveTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-teal-400 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-5 w-5 min-w-[1.25rem] ${isActive ? 'drop-shadow-[0_0_6px_rgba(20,184,166,0.5)]' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id} delayDuration={0}>
                  <TooltipTrigger asChild>{btn}</TooltipTrigger>
                  <TooltipContent side="right" className="bg-navy-800 text-white border-white/10">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return btn;
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4">
        <Separator className="bg-white/5 mb-4" />
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-gray-500 text-center"
            >
              Commercial Bank of Ethiopia
              <br />
              © 2026 EWS v1.0
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CrmManagerSidebar(props: CrmManagerSidebarProps) {
  const { collapsed, mobileOpen, onMobileClose } = props;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 bottom-0 z-30 hidden md:block border-r border-white/5"
        style={{ background: 'rgba(10, 15, 30, 0.95)' }}
      >
        <SidebarContent {...props} />
      </motion.aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent
          side="left"
          className="w-[280px] p-0 border-r border-white/5"
          style={{ background: 'rgba(10, 15, 30, 0.98)' }}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent {...props} collapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}
