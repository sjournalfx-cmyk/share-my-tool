import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePasswordScreen: React.FC = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = () => {
         setIsLoading(true);
         // Mock update delay
         setTimeout(() => {
             setIsLoading(false);
             navigate(-1);
         }, 1500);
    };

    const isValid = currentPassword && newPassword && newPassword === confirmPassword;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in">
            <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Change Password</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                 <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
                    <span className="material-symbols-outlined text-blue-500">lock</span>
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                        <p className="font-bold mb-1">Secure your account</p>
                        <p className="text-xs">Your password should be at least 8 characters and include special characters.</p>
                    </div>
                 </div>

                 <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-0"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-0"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full h-12 px-4 rounded-xl bg-white dark:bg-surface-dark border focus:ring-0 transition-colors ${confirmPassword && newPassword !== confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-primary'}`}
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not match</p>
                        )}
                    </div>
                 </div>
            </div>
             <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark pb-8 safe-area-pb">
                <button 
                    onClick={handleUpdate} 
                    disabled={!isValid || isLoading}
                    className={`w-full h-14 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${!isValid || isLoading ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:bg-sky-500 active:scale-95'}`}
                >
                    {isLoading ? (
                        <>
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Updating...</span>
                        </>
                    ) : (
                        <span>Update Password</span>
                    )}
                </button>
             </div>
        </div>
    );
};

export default ChangePasswordScreen;