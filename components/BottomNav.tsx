import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BottomNavProps {
  active: 'explore' | 'rentals' | 'listings' | 'profile';
}

const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const navigate = useNavigate();

  const getButtonClass = (name: string) => {
    const isActive = active === name;
    const colorClass = isActive 
      ? "text-primary scale-110" 
      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300";
    return `flex flex-col items-center gap-1 ${colorClass} w-14 transition-all duration-200 cursor-pointer p-1`;
  };

  return (
    <div className="absolute bottom-0 w-full z-50 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 h-[84px] pb-6 pt-3 px-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <button onClick={() => navigate('/map')} className={getButtonClass('explore')}>
        <span className="material-symbols-outlined text-[24px] fill-current">map</span>
        <span className="text-[10px] font-semibold">Explore</span>
      </button>
      <button onClick={() => navigate('/rentals')} className={getButtonClass('rentals')}>
        <span className="material-symbols-outlined text-[24px]">handshake</span>
        <span className="text-[10px] font-medium">Rentals</span>
      </button>
      <button onClick={() => navigate('/dashboard')} className={getButtonClass('listings')}>
        <span className="material-symbols-outlined text-[24px]">storefront</span>
        <span className="text-[10px] font-medium">Listings</span>
      </button>
      <button onClick={() => navigate('/profile')} className={getButtonClass('profile')}>
        <span className="material-symbols-outlined text-[24px]">person</span>
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;