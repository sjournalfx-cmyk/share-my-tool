
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const RentalsScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [rentalTab, setRentalTab] = useState<'upcoming' | 'inbox' | 'history'>('upcoming');

    // Check if we just accepted a request
    const hasAcceptedRequest = location.state?.requestAccepted;

    const rentalHistory = [
        {
            id: 101,
            title: "Extension Ladder 24ft",
            date: "Sep 20 - Sep 22",
            cost: 45.00,
            image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 102,
            title: "Makita Circular Saw",
            date: "Aug 10 - Aug 11",
            cost: 25.00,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBefBvpWZSN4SUVMn7ibyHshD4pAkp3yzyZfwLk6LawaALYcxz_MgWOsWVz63-JqLckR2ilSCbbYclJI2aETnQN6mDAKKRbj-bib-VC5mnooUU2bMVjfnWTP72QnoOazo14fWVHaZ_KvV8JMd8aMFX5vwTtrhppPz66OhGp6kIiRlYa04J_wbBwFxUZjC2evahiP9OGyGRGC1JbT6zHdAiPV08Ir1rnqZl8HDNFG7oSji7z8qChks2XaN0kyH6iPqY8878XQws0mXJJ"
        }
    ];

    const handleDownloadReceipt = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Toast logic could go here
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111618] dark:text-white antialiased h-full flex flex-col overflow-hidden animate-fade-in relative">
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-transparent dark:border-white/5">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">My Activity</h2>
                </header>

                <div className="px-4 py-4 space-y-6">
                    
                    {/* QR Code Pass Button */}
                    <button 
                        onClick={() => navigate('/qr-pass')}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-transform group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="size-12 bg-white/10 dark:bg-slate-200/20 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">qr_code_2</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-lg leading-tight">Identity Pass</p>
                                <p className="text-xs text-slate-300 dark:text-slate-500">Show this code during meetup</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>

                    {/* Tabs including Inbox */}
                    <section>
                         <div className="flex bg-gray-200 dark:bg-white/10 rounded-lg p-0.5 mb-4">
                            <button 
                                onClick={() => setRentalTab('upcoming')}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${rentalTab === 'upcoming' ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Active
                            </button>
                            <button 
                                onClick={() => setRentalTab('inbox')}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${rentalTab === 'inbox' ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                Inbox
                                {!hasAcceptedRequest && (
                                    <span className="size-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                            <button 
                                onClick={() => setRentalTab('history')}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${rentalTab === 'history' ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                History
                            </button>
                        </div>
                        
                        {/* INBOX TAB CONTENT */}
                        {rentalTab === 'inbox' && (
                            <div className="animate-fade-in space-y-6">
                                {/* Booking Requests */}
                                {!hasAcceptedRequest ? (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 px-1">
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                            </span>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#617c89] dark:text-slate-400">Booking Requests</h3>
                                        </div>

                                        <div 
                                            onClick={() => navigate('/owner-request')}
                                            className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-l-4 border-slate-100 dark:border-slate-800 border-l-red-500 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop')"}}></div>
                                                    <div>
                                                        <p className="font-bold text-sm dark:text-white">Alex wants to rent</p>
                                                        <p className="text-xs text-slate-500">Bosch Hammer Drill</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">+$25</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    <span>4 Hours</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    <span>Today, 2:00 PM</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-2">inbox</span>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No pending booking requests</p>
                                    </div>
                                )}

                                {/* Messages */}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#617c89] dark:text-slate-400 mb-3 px-1">Messages</h3>
                                    <div onClick={() => navigate('/chat')} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 items-center cursor-pointer active:scale-[0.99] transition-transform">
                                        <div className="relative">
                                            <div className="size-12 rounded-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQCnxcTiY5nKrKkYNtVae8ksL-Qvss7nooNMjfbB1JM2WRRrZjWNpbS7cixDmYPOSqUqORPLNIdJ7kC14bNjFIrhkBoNwBpRxo36Yhu5IIz0BGr-rMAm66_afFSyL9jwTP7-ie9g5puePG7KgMTLX9wF16_0uYkWPaO2tbZj3unr6_CyepmSQOxPbDFSRynQqNoHDOSMLa5GNcXNHMZgNWyDMjwLyJjlfNe2A6IUYwSfdDn4nBHipdRTLKZMtnPD_5GjNkhwDcD66h')"}}></div>
                                            <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-surface-dark rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Sarah M.</h4>
                                                <span className="text-xs text-slate-400">10:30 AM</span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Sounds good! Feel free to book whenever you're ready.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* ACTIVE TAB CONTENT */}
                        {rentalTab === 'upcoming' && (
                            <div className="animate-slide-up">
                                {/* Renter Mode Card */}
                                {!hasAcceptedRequest ? (
                                    <div onClick={() => navigate('/rental?mode=renter')} className="group flex flex-col gap-4 rounded-2xl border border-primary/20 bg-white dark:bg-surface-dark p-4 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.99]">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                                        <div className="flex gap-4">
                                            <div className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden relative">
                                                <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe6Wcs7CcKOtPxjafC55ogztY2wJ8xLE0vBvtYnW-5OQXxVdVlxElKh61XV-kCRxANw6JxdCigI6Xflf49KuKwluJqIR3a6UMLsA2ri1_4aSQzxppoY8qRtd03DBcFzPtgCyTnbSLDzpaQVLLzDKosoSkOi0Pqcta8vCABc4hZhum1xqf4ax-eUDYI1Ki-j6UoxJZmxC6qRCqvBHA2ppGhE7y4wEHiMLM05h-PYtvG3xBeqZEQcnPQ9swZQukIWjg8N_5m0GcCI94I"/>
                                            </div>
                                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-[#111618] dark:text-white text-base font-bold leading-tight truncate pr-2">DeWalt 20V Drill</p>
                                                    <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide">Pickup Today</span>
                                                </div>
                                                <p className="text-[#617c89] dark:text-slate-400 text-sm font-medium">10:00 AM - 10:30 AM</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                                    <span className="truncate">Mission District, SF</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-primary/5 dark:bg-primary/10 rounded-lg py-2.5 flex items-center justify-center gap-2 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span>Start Rental Handshake</span>
                                            <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                                        </div>
                                    </div>
                                ) : (
                                    // Owner Mode Card (Appears after accepting request)
                                    <div onClick={() => navigate('/rental?mode=owner')} className="group flex flex-col gap-4 rounded-2xl border border-green-500/20 bg-white dark:bg-surface-dark p-4 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.99]">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                                        <div className="flex gap-4">
                                            <div className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden relative">
                                                <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBefBvpWZSN4SUVMn7ibyHshD4pAkp3yzyZfwLk6LawaALYcxz_MgWOsWVz63-JqLckR2ilSCbbYclJI2aETnQN6mDAKKRbj-bib-VC5mnooUU2bMVjfnWTP72QnoOazo14fWVHaZ_KvV8JMd8aMFX5vwTtrhppPz66OhGp6kIiRlYa04J_wbBwFxUZjC2evahiP9OGyGRGC1JbT6zHdAiPV08Ir1rnqZl8HDNFG7oSji7z8qChks2XaN0kyH6iPqY8878XQws0mXJJ"/>
                                            </div>
                                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-[#111618] dark:text-white text-base font-bold leading-tight truncate pr-2">Bosch Hammer Drill</p>
                                                    <span className="text-[10px] font-bold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide">Handoff Today</span>
                                                </div>
                                                <p className="text-[#617c89] dark:text-slate-400 text-sm font-medium">2:00 PM (In 15 mins)</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                    <span className="material-symbols-outlined text-sm">person</span>
                                                    <span className="truncate">Meeting Alex</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-green-50 dark:bg-green-900/10 rounded-lg py-2.5 flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <span>Initialize Handoff</span>
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* HISTORY TAB CONTENT */}
                        {rentalTab === 'history' && (
                            <div className="flex flex-col gap-3 animate-slide-up">
                                {rentalHistory.map(item => (
                                    <div key={item.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4">
                                        <div className="h-20 w-20 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                                            <img className="h-full w-full object-cover grayscale opacity-80" src={item.image} alt={item.title}/>
                                        </div>
                                        <div className="flex flex-col flex-1 justify-between py-1">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.date}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">${item.cost.toFixed(2)}</span>
                                                <button 
                                                    onClick={handleDownloadReceipt}
                                                    className="text-primary text-xs font-bold flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded-md transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">receipt_long</span>
                                                    Receipt
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <BottomNav active="rentals" />
        </div>
    );
};

export default RentalsScreen;
