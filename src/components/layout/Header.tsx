import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import type { UserRole, ActiveTab } from '@/types';
import cbeIcon from '@/assets/icon-cbe.png';

const ROLES: UserRole[] = ['ADMIN', 'CRM MANAGER', 'CRM OFFICER', 'MONITORING OFFICER'];

interface HeaderProps {
  activeTab: ActiveTab;
  onToggleSidebar: () => void;
}

const PAGE_TITLES: Record<ActiveTab, string> = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  options: 'Options',
  cases: 'Cases',
  report: 'Report',
  newCases: 'New Cases',
  completedCases: 'Complete Case',
};

export default function Header({ activeTab, onToggleSidebar }: HeaderProps) {
  const { userName, role, switchRole } = useAuth();

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
      className="fixed top-0 right-0 left-0 z-40 h-16 bg-white border-b border-purple-100 shadow-sm"
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-purple-600 hover:text-purple-500 hover:bg-purple-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <img src={cbeIcon} alt="CBE Logo" className="h-14 w-auto object-contain bg-transparent" />
            <div className="hidden sm:flex flex-col items-center justify-center space-y-2">
              <span className="text-xl font-bold text-gray-900 leading-tight">Commercial Bank of Ethiopia</span>
              <span className="text-lg font-bold text-purple-600 leading-tight tracking-wide text-center">Early Warning System</span>
            </div>
          </div>
        </div>

        {/* Center: Page title */}
        <motion.h1
          key={activeTab}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-lg font-semibold text-gray-800 hidden md:block"
        >
          {PAGE_TITLES[activeTab]}
        </motion.h1>

        {/* Right: User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-3 hover:bg-purple-50 px-2 md:px-3 py-2 rounded-md cursor-pointer transition-colors outline-none"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-800 leading-none">
                {userName}
              </p>
              <Badge
                variant="outline"
                className="mt-1 text-[10px] border-purple-300 text-purple-600"
              >
                {role}
              </Badge>
            </div>
            <Avatar className="h-9 w-9 border-2 border-purple-300">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border-purple-100 text-gray-800"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-sm text-purple-600">
                {userName}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
