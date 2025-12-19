import React from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerRequestScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleAccept = () => {
        // Navigate back to rentals with state indicating request was accepted
        navigate('/rentals', { state: { requestAccepted: true } });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark h-full flex flex-col font-display animate-fade-in relative">
            
            {/* Header */}
            <div className="flex items-center px-4 py-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm z-10">
                <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">close</span>
                </button>
                <div className="flex-1 text-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Booking Request</h2>
                </div>
                <div className="size-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-24">
                
                {/* Renter Profile Card */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-4">
                    <div className="relative">
                        <div className="size-16 rounded-full bg-gray-200 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop')"}}></div>
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-surface-dark p-1 rounded-full">
                            <span className="material-symbols-outlined text-blue-500 text-sm bg-blue-100 dark:bg-blue-900/30 rounded-full p-0.5" title="Verified ID">verified</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Alex Johnson</h3>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                            <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">5.0</span>
                            <span>(4 reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1 bg-green-50 dark:bg-green-900/10 px-2 py-0.5 rounded-md w-fit">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            <span>ID Verified</span>
                        </div>
                    </div>
                </div>

                {/* The Message */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-6 relative">
                    <div className="absolute top-4 left-[-8px] w-4 h-4 bg-white dark:bg-surface-dark border-l border-b border-slate-100 dark:border-slate-800 transform rotate-45"></div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                        "Hi, I need this for a fence project this Saturday. I can pick it up around 2 PM. Is that okay?"
                    </p>
                </div>

                {/* The Deal */}
                <div className="mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Request Details</h3>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-1 shadow-sm border border-slate-100 dark:border-slate-800">
                         <div className="flex gap-4 p-3 border-b border-slate-100 dark:border-slate-800">
                             <div className="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 bg-cover bg-center shrink-0" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBefBvpWZSN4SUVMn7ibyHshD4pAkp3yzyZfwLk6LawaALYcxz_MgWOsWVz63-JqLckR2ilSCbbYclJI2aETnQN6mDAKKRbj-bib-VC5mnooUU2bMVjfnWTP72QnoOazo14fWVHaZ_KvV8JMd8aMFX5vwTtrhppPz66OhGp6kIiRlYa04J_wbBwFxUZjC2evahiP9OGyGRGC1JbT6zHdAiPV08Ir1rnqZl8HDNFG7oSji7z8qChks2XaN0kyH6iPqY8878XQws0mXJJ')"}}></div>
                             <div>
                                 <p className="font-bold text-slate-900 dark:text-white text-sm">Bosch Hammer Drill</p>
                                 <p className="text-xs text-slate-500">Pickup in Mission District</p>
                             </div>
                         </div>
                         <div className="p-4 grid grid-cols-2 gap-4">
                             <div>
                                 <p className="text-xs text-slate-400 mb-1">Date & Time</p>
                                 <p className="font-bold text-slate-900 dark:text-white text-sm">Today, 2:00 PM</p>
                             </div>
                             <div>
                                 <p className="text-xs text-slate-400 mb-1">Duration</p>
                                 <p className="font-bold text-slate-900 dark:text-white text-sm">4 Hours</p>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Earnings */}
                <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-4 border border-green-100 dark:border-green-900/20 flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                            <span className="material-symbols-outlined">attach_money</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Est. Earnings</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">After service fees</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">$25.00</span>
                </div>
            </div>

            {/* Actions */}
            <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-background-dark p-4 pb-8 border-t border-slate-100 dark:border-slate-800 flex gap-3 shadow-lg z-20">
                <button 
                    onClick={() => navigate('/chat')}
                    className="flex flex-col items-center justify-center min-w-[70px] h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                    <span className="material-symbols-outlined">chat</span>
                    <span className="text-[10px] font-bold">Chat</span>
                </button>
                <button className="flex-1 h-14 rounded-xl font-bold text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
                    Decline
                </button>
                <button 
                    onClick={handleAccept}
                    className="flex-[2] h-14 rounded-xl font-bold text-white bg-green-600 hover:bg-green-500 shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">check_circle</span>
                    <span>Accept Request</span>
                </button>
            </div>
        </div>
    );
};

export default OwnerRequestScreen;