import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Briefcase,
  FileText,
  ClipboardList,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import type { ActiveTab } from '@/types';
import cbeIcon from '@/assets/icon-cbe.png';

interface SidebarProps {
  collapsed: boolean;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const ADMIN_NAV_ITEMS: { id: ActiveTab | 'logout'; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'options', label: 'Options', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

const MONITORING_NAV_ITEMS: { id: ActiveTab | 'logout'; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cases', label: 'Cases', icon: Briefcase },
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

const CRM_NAV_ITEMS: { id: ActiveTab | 'logout'; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'newCases', label: 'New Cases', icon: Briefcase },
  { id: 'completedCases', label: 'Complete Case', icon: FileText },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

const CRM_OFFICER_NAV_ITEMS: { id: ActiveTab | 'logout'; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'crm-new-cases', label: 'New Assigned Cases', icon: ClipboardList },
  { id: 'crm-completed-cases', label: 'Completed Cases', icon: CheckCircle },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

function SidebarContent({
  collapsed,
  activeTab,
  onTabChange,
  onLogout,
}: Omit<SidebarProps, 'mobileOpen' | 'onMobileClose'>) {
  const { userName, role } = useAuth();
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleClick = (id: ActiveTab | 'logout') => {
    if (id === 'logout') {
      onLogout();
    } else {
      onTabChange(id);
    }
  };

  const navItems =
    role === 'MONITORING OFFICER'
      ? MONITORING_NAV_ITEMS
      : role === 'CRM MANAGER'
        ? CRM_NAV_ITEMS
        : role === 'CRM OFFICER'
          ? CRM_OFFICER_NAV_ITEMS
          : ADMIN_NAV_ITEMS;

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Logo Section */}
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        <div className={`flex items-center justify-center overflow-hidden ${collapsed ? 'h-10 w-10' : 'h-16 w-16'} transition-all duration-300`}>
          <img
            src={cbeIcon}
            alt="CBE"
            className="h-full w-full object-contain"
          />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center mt-2 overflow-hidden"
            >
              <h2
                className="text-lg font-bold"
                style={{ color: '#c41fa8' }}
              >
                EWS
              </h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Early Warning System
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="mx-4" style={{ backgroundColor: '#f0e6ee' }} />

      {/* Nav Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.id !== 'logout' && activeTab === item.id;
            const isLogout = item.id === 'logout';
            const Icon = item.icon;

            const btn = (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleClick(item.id)}
                className={`
                  w-full justify-start gap-3 h-11 relative group transition-all duration-200 rounded-lg
                  ${collapsed ? 'px-3 justify-center' : 'px-4'}
                  ${isActive
                    ? 'text-white hover:text-white'
                    : isLogout
                      ? 'text-red-400/70 hover:text-red-500 hover:bg-red-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #c41fa8 0%, #a61d94 100%)',
                        boxShadow: '0 2px 8px rgba(196, 31, 168, 0.3)',
                        fontFamily: "'Times New Roman', Times, serif",
                      }
                    : { fontFamily: "'Times New Roman', Times, serif" }
                }
              >
                <Icon
                  className={`h-5 w-5 min-w-[1.25rem] ${
                    isActive ? 'text-white' : ''
                  }`}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            );

            if (collapsed) {
              return (
                <TooltipProvider delay={0} key={item.id}>
                  <Tooltip>
                    <TooltipTrigger>{btn}</TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-white text-gray-800 border border-gray-200 shadow-lg"
                    >
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }
            return btn;
          })}
        </nav>
      </ScrollArea>

      {/* Footer: User Profile */}
      <div className="p-4">
        <Separator className="mb-4" style={{ backgroundColor: '#f0e6ee' }} />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Avatar className="h-10 w-10 border-2" style={{ borderColor: 'rgba(196, 31, 168, 0.3)' }}>
                  <AvatarFallback
                    className="text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #c41fa8 0%, #a61d94 100%)' }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {userName}
                  </p>
                  <p className="text-[11px]" style={{ color: '#c41fa8' }}>
                    {role}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="flex justify-center">
            <Avatar className="h-9 w-9 border-2" style={{ borderColor: 'rgba(196, 31, 168, 0.3)' }}>
              <AvatarFallback
                className="text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #c41fa8 0%, #a61d94 100%)' }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Sidebar(props: SidebarProps) {
  const { collapsed, mobileOpen, onMobileClose } = props;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 bottom-0 z-30 hidden md:block border-r"
        style={{
          background: '#ffffff',
          borderColor: '#f0e6ee',
        }}
      >
        <SidebarContent {...props} />
      </motion.aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent
          side="left"
          className="w-[260px] p-0 border-r"
          style={{
            background: '#ffffff',
            borderColor: '#f0e6ee',
          }}
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
