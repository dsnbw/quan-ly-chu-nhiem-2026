import React from 'react';
import { LayoutDashboard, Users, Grid, Wallet, Menu } from 'lucide-react';
import clsx from 'clsx';

interface MobileNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMenu
}) => {
  const items = [
    { id: 'dashboard', label: 'Bàn làm việc', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'students', label: 'Học sinh', icon: <Users className="w-5 h-5" /> },
    { id: 'seating', label: 'Sơ đồ lớp', icon: <Grid className="w-5 h-5" /> },
    { id: 'attendance', label: 'Chuyên cần', icon: <Wallet className="w-5 h-5" /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
      {items.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={clsx(
              'flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl transition-colors',
              isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center min-h-[48px] min-w-[56px] px-2 py-1 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Thêm</span>
      </button>
    </nav>
  );
};
