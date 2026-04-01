import { motion } from 'framer-motion';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import type { ActiveTab } from '@/types';

interface HeaderProps {
  activeTab: ActiveTab;
  onToggleSidebar: () => void;
}

export default function Header({ activeTab, onToggleSidebar }: HeaderProps) {
  const { userName, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 right-0 left-0 z-40 h-16"
      style={{
        background: 'linear-gradient(135deg, #c41fa8 0%, #9c1585 100%)',
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: Hamburger */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-white hover:text-white/90 hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Center: Title */}
        <div className="flex-1 flex justify-center">
          <h1
            className="text-lg md:text-xl font-bold text-white tracking-wide"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Early Warning System
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10 relative"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* User icon */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <User className="h-5 w-5" />
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            onClick={logout}
            className="text-white/90 hover:text-white hover:bg-white/10 gap-1.5 text-sm hidden sm:flex"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
          {/* Mobile logout (icon only) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-white/90 hover:text-white hover:bg-white/10 sm:hidden"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
