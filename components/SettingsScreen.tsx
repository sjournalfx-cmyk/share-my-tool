
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsScreen: React.FC = () => {
    const navigate = useNavigate();
    
    // Check initial dark mode state
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
    const [pushNotifs, setPushNotifs] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        }
    };

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 2000);
    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirm(false);
        showToast("Account scheduled for deletion");
        setTimeout(() => navigate('/'), 2000);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in relative">
            
            {/* Toast Notification */}
            {toast && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] animate-fade-in w-max max-w-[90%]">
                    <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-slate-900 px-4 py-3 rounded-xl text-sm font-medium shadow-xl flex items-center gap-2">
                         <span className="material-symbols-outlined text-white dark:text-slate-900 text-[20px]">info</span>
                         {toast}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate('/profile')} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Settings</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* App Preferences */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">App Preferences</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                        
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className={`size-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-blue-100 text-blue-600'}`}>
                                    <span className="material-symbols-outlined text-lg">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
                                </div>
                                <span className="font-medium text-sm">Dark Mode</span>
                            </div>
                            <button 
                                onClick={toggleDarkMode}
                                className={`w-12 h-7 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                                <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                         {/* Notifications */}
                         <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-lg">notifications</span>
                                </div>
                                <span className="font-medium text-sm">Push Notifications</span>
                            </div>
                            <button 
                                onClick={() => {
                                    setPushNotifs(!pushNotifs);
                                    showToast(!pushNotifs ? "Notifications Enabled" : "Notifications Disabled");
                                }}
                                className={`w-12 h-7 rounded-full transition-colors relative ${pushNotifs ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                                <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${pushNotifs ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Account Settings */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Account</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <button 
                            onClick={() => navigate('/settings/edit-profile')}
                            className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">person</span>
                                <span className="font-medium text-sm">Edit Profile</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                        </button>
                        <button 
                            onClick={() => navigate('/settings/change-password')}
                            className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">lock</span>
                                <span className="font-medium text-sm">Change Password</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                        </button>
                    </div>
                </section>

                {/* Service Provider Settings */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Service Provider</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <button 
                            onClick={() => navigate('/settings/service-profile')}
                            className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">engineering</span>
                                <span className="font-medium text-sm">Skills & Profession</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                        </button>
                    </div>
                </section>

                {/* Legal & Danger Zone */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Support & Legal</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <button 
                            onClick={() => showToast("Opening Terms of Service...")}
                            className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">article</span>
                                <span className="font-medium text-sm">Terms of Service</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                        </button>
                        <button 
                            onClick={() => showToast("Opening Privacy Policy...")}
                            className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-slate-400">policy</span>
                                <span className="font-medium text-sm">Privacy Policy</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                        </button>
                         <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-500">delete</span>
                                <span className="font-medium text-sm text-red-500">Delete Account</span>
                            </div>
                        </button>
                    </div>
                </section>
                
                <div className="text-center pb-8 pt-4">
                    <p className="text-xs text-slate-400">Version 1.0.0 (Prototype)</p>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-slide-up">
                        <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 mx-auto">
                            <span className="material-symbols-outlined text-2xl">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">Delete Account?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6 leading-relaxed">
                            This action cannot be undone. All your data and active rentals will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 h-12 rounded-xl font-bold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteAccount}
                                className="flex-1 h-12 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsScreen;
