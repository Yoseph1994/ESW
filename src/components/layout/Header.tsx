import { motion } from 'framer-motion';
import { Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import type { UserRole, ActiveTab } from '@/types';

const ROLES: UserRole[] = ['ADMIN', 'CRM MANAGER', 'CRM OFFICER', 'MONITORING OFFICER'];

interface HeaderProps {
  activeTab: ActiveTab;
  onToggleSidebar: () => void;
}

const PAGE_TITLES: Record<ActiveTab, string> = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  options: 'Options',
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

        {/* Right: User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
              className="flex items-center gap-3 hover:bg-white/5 px-2 md:px-3 py-2 rounded-md cursor-pointer transition-colors outline-none"
            >
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
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 glass-card border-white/10 text-white"
          >
            <DropdownMenuLabel className="text-sm text-teal-400">
              {userName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch Role (Dev)
            </DropdownMenuLabel>
            {ROLES.map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => switchRole(r)}
                className={`cursor-pointer text-sm ${
                  r === role
                    ? 'text-teal-400 bg-teal-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {r === role && '✓ '}
                {r}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
