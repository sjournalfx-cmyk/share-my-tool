
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useUser } from '../context/UserContext';

const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const menuItems = [
        { icon: 'groups', label: 'Neighborhood Circles', badge: 'New', path: '/circles' },
        { icon: 'favorite', label: 'Favorites', badge: '3', path: '/favorites' },
        { icon: 'account_balance_wallet', label: 'Wallet & Earnings', path: '/wallet' },
        { icon: 'notifications', label: 'Notifications', badge: '2', path: '/notifications' },
        { icon: 'settings', label: 'Settings', path: '/settings' },
        { icon: 'help', label: 'Help & Support', path: '/help' },
    ];

    const handleNavigation = (path: string | null) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col overflow-hidden animate-fade-in relative">
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                <div className="p-6 pb-2">
                    <h1 className="text-2xl font-bold mb-6">Profile</h1>
                    
                    {/* User Card */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                        <div 
                            className="size-24 sm:size-20 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-md shrink-0" 
                            style={{backgroundImage: `url('${user.avatar}')`}}
                        ></div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">{user.name}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Joined {user.joinDate}</p>
                                </div>
                                <button 
                                    onClick={() => navigate('/settings/edit-profile')}
                                    className="sm:hidden text-primary font-bold text-sm bg-primary/10 px-3 py-1.5 rounded-lg"
                                >
                                    Edit
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-1 mt-1 text-sm font-medium text-amber-500">
                                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                                <span>{user.rating.toFixed(1)} ({user.reviews} reviews)</span>
                            </div>

                            {user.bio && (
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                                    {user.bio}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div 
                        onClick={() => navigate('/verify')}
                        className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform mb-6"
                    >
                        <div className="flex items-center gap-3">
                             <div className="size-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                                 <span className="material-symbols-outlined">verified_user</span>
                             </div>
                             <div>
                                 <p className="font-bold text-sm">Verify Identity</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">Complete verification to rent tools</p>
                             </div>
                        </div>
                        <span className="material-symbols-outlined text-primary">chevron_right</span>
                    </div>

                    {/* Menu */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                        {menuItems.map((item, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 transition-colors ${
                                    item.path 
                                    ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer active:bg-slate-100' 
                                    : 'opacity-60 cursor-default'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined ${item.path ? 'text-slate-400' : 'text-slate-300'}`}>{item.icon}</span>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.badge && (
                                        <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badge === 'New' ? 'bg-primary' : 'bg-red-500'}`}>{item.badge}</span>
                                    )}
                                    {item.path && <span className="material-symbols-outlined text-slate-300">chevron_right</span>}
                                    {!item.path && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">SOON</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => navigate('/')}
                        className="w-full mt-6 py-4 text-red-500 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>

            <BottomNav active="profile" />
        </div>
    );
};

export default ProfileScreen;