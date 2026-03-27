/**
 * CRM Manager Header
 * Mirrors the Admin Header design exactly, with CRM Manager-specific page titles.
 * No dev role-switcher — just user profile display.
 */
import { motion } from 'framer-motion';
import { Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import type { CrmActiveTab } from '@/types';

interface CrmManagerHeaderProps {
  activeTab: CrmActiveTab;
  onToggleSidebar: () => void;
}

/** Page title map for CRM Manager tabs */
const PAGE_TITLES: Record<CrmActiveTab, string> = {
  dashboard: 'Dashboard',
  newCases: 'New Cases',
  completedCases: 'Complete Case',
};

export default function CrmManagerHeader({ activeTab, onToggleSidebar }: CrmManagerHeaderProps) {
  const { userName, role } = useAuth();

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 right-0 left-0 z-40 h-16 glass-card border-b border-white/5"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">
              EWS
            </span>
          </div>
        </div>

        {/* Center: Page title */}
        <motion.h1
          key={activeTab}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-lg font-semibold text-white hidden md:block"
        >
          {PAGE_TITLES[activeTab]}
        </motion.h1>

        {/* Right: User profile */}
        <div className="flex items-center gap-3 px-2 md:px-3 py-2 rounded-md">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-white leading-none">
              {userName}
            </p>
            <Badge
              variant="outline"
              className="mt-1 text-[10px] border-teal-500/50 text-teal-400"
            >
              {role}
            </Badge>
          </div>
          <Avatar className="h-9 w-9 border-2 border-teal-500/30">
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-700 text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.header>
  );
}
