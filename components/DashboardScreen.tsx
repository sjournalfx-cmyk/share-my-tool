
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const DashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [vacationMode, setVacationMode] = useState(false);
    const [chartLoaded, setChartLoaded] = useState(false);
    
    // Filter State
    const [activeTab, setActiveTab] = useState<'active' | 'rented' | 'drafts'>('active');

    useEffect(() => {
        // Trigger chart animation after mount
        setTimeout(() => setChartLoaded(true), 100);
    }, []);

    // Expanded Inventory Data
    const inventory = [
        {
            id: 1,
            title: "Bosch Hammer Drill",
            price: 40,
            status: "Available",
            views: 124,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBefBvpWZSN4SUVMn7ibyHshD4pAkp3yzyZfwLk6LawaALYcxz_MgWOsWVz63-JqLckR2ilSCbbYclJI2aETnQN6mDAKKRbj-bib-VC5mnooUU2bMVjfnWTP72QnoOazo14fWVHaZ_KvV8JMd8aMFX5vwTtrhppPz66OhGp6kIiRlYa04J_wbBwFxUZjC2evahiP9OGyGRGC1JbT6zHdAiPV08Ir1rnqZl8HDNFG7oSji7z8qChks2XaN0kyH6iPqY8878XQws0mXJJ"
        },
        {
            id: 2,
            title: "Pressure Washer 3000PSI",
            price: 65,
            status: "Rented",
            until: "Oct 15",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArpF3ROoh7UKbbsHugDaYhONZK38MIfiTpV2CFV9XxWzI1V2UhnVxhzoN6i2TuOh4jF_kaeDMbMvG_ij_pjpzCUtkiyz7mlqXLK5jtrpt6cFrKn0nRTXz8U4Y1ok_75ybOt4qyUiybG8z12ZLGXH4OIEB80ykIfjpfztshNv7dPTelYNnbCA6wkk-x-B-jpLpdX6EMr2X70kRmRab3K2UgpwZRjJSIgGcKrgdoCKxqpEa74tqMEw-qTc3jvOgo6I-3pRkGYwBtBCjo"
        },
        {
            id: 3,
            title: "Makita Circular Saw",
            price: 25,
            status: "Draft",
            views: 0,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBefBvpWZSN4SUVMn7ibyHshD4pAkp3yzyZfwLk6LawaALYcxz_MgWOsWVz63-JqLckR2ilSCbbYclJI2aETnQN6mDAKKRbj-bib-VC5mnooUU2bMVjfnWTP72QnoOazo14fWVHaZ_KvV8JMd8aMFX5vwTtrhppPz66OhGp6kIiRlYa04J_wbBwFxUZjC2evahiP9OGyGRGC1JbT6zHdAiPV08Ir1rnqZl8HDNFG7oSji7z8qChks2XaN0kyH6iPqY8878XQws0mXJJ"
        },
        {
            id: 4,
            title: "Extension Ladder 24ft",
            price: 20,
            status: "Available",
            views: 45,
            image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    // Derived State
    const filteredInventory = inventory.filter(item => {
        if (activeTab === 'active') return item.status === 'Available';
        if (activeTab === 'rented') return item.status === 'Rented';
        if (activeTab === 'drafts') return item.status === 'Draft';
        return false;
    });

    const publishedCount = inventory.filter(i => i.status !== 'Draft').length;

    const toggleMenu = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleMenuAction = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        setActiveMenuId(null);
        
        if (action === 'Edit') {
             navigate('/upload');
             return;
        }

        setToastMessage(`${action} action triggered`);
        setTimeout(() => setToastMessage(null), 2000);
    };

    const toggleVacationMode = () => {
        setVacationMode(!vacationMode);
        setToastMessage(!vacationMode ? "Vacation Mode Enabled" : "You are back online");
        setTimeout(() => setToastMessage(null), 2000);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111618] dark:text-white antialiased selection:bg-primary/30 h-full flex flex-col overflow-hidden animate-fade-in relative" onClick={() => setActiveMenuId(null)}>
            
            {/* Toast for Feedback */}
            {toastMessage && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] animate-fade-in w-max max-w-[90%]">
                    <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-slate-900 px-4 py-3 rounded-xl text-sm font-medium shadow-xl flex items-center gap-2">
                         <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                         {toastMessage}
                    </div>
                </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 border-b border-transparent dark:border-white/5 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">My Listings</h2>
                        <button onClick={() => navigate('/upload')} className="flex items-center justify-center rounded-full h-10 w-10 bg-white dark:bg-surface-dark text-primary shadow-sm hover:shadow-md transition-all active:scale-95" aria-label="Add new listing">
                            <span className="material-symbols-outlined text-[26px]">add</span>
                        </button>
                    </div>
                    
                    {/* Vacation Mode Toggle */}
                    <div className="bg-white dark:bg-surface-dark p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${vacationMode ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                <span className="material-symbols-outlined">{vacationMode ? 'beach_access' : 'store'}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">{vacationMode ? 'Vacation Mode' : 'Accepting Rentals'}</p>
                                <p className="text-[10px] text-slate-500">{vacationMode ? 'Listings are hidden' : 'Your listings are visible'}</p>
                            </div>
                        </div>
                        <button 
                            role="switch"
                            aria-checked={vacationMode}
                            onClick={toggleVacationMode}
                            className={`w-12 h-7 rounded-full transition-colors relative ${vacationMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                        >
                            <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${vacationMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </header>

                {vacationMode && (
                    <div className="px-4 py-2">
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            Your listings are currently unavailable to renters.
                        </div>
                    </div>
                )}

                <section className="px-4 py-4">
                    <div className="flex gap-3">
                        <div className="flex flex-1 flex-col justify-between gap-1 rounded-2xl p-4 bg-white dark:bg-surface-dark shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-white/5 relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                    <span className="material-symbols-outlined text-lg">attach_money</span>
                                </div>
                                <p className="text-[#617c89] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Earnings</p>
                            </div>
                            <p className="text-[#111618] dark:text-white text-2xl font-bold tracking-tight mb-2">$1,250</p>
                            
                            {/* Animated Bar Chart */}
                            <div className="flex items-end justify-between h-8 gap-1 mt-auto px-1">
                                {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                                    <div key={i} className="w-full bg-green-500/10 dark:bg-green-500/20 rounded-sm relative group overflow-hidden">
                                        <div 
                                            className="absolute bottom-0 w-full bg-green-500 rounded-sm transition-all duration-1000 ease-out" 
                                            style={{ height: chartLoaded ? `${h}%` : '0%' }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-1 rounded-2xl p-4 bg-white dark:bg-surface-dark shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <span className="material-symbols-outlined text-lg">build_circle</span>
                                </div>
                                <p className="text-[#617c89] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Published</p>
                            </div>
                            <p className="text-[#111618] dark:text-white text-2xl font-bold tracking-tight">{publishedCount} <span className="text-sm font-medium text-[#617c89] dark:text-slate-500">{vacationMode ? 'paused' : 'live'}</span></p>
                             <div className="flex -space-x-2 mt-auto pt-2">
                                 {[1,2,3].slice(0, Math.min(publishedCount, 3)).map(i => (
                                     <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-surface-dark bg-gray-200 ${vacationMode ? 'grayscale' : ''}`} style={{backgroundImage: `url('https://i.pravatar.cc/100?img=${i+10}')`, backgroundSize: 'cover'}}></div>
                                 ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-4 pb-2">
                    <h3 className="text-[#111618] dark:text-white text-xl font-bold leading-tight mb-4">Inventory</h3>
                    
                    {/* Tabs */}
                    <div className="flex p-1 bg-gray-200/60 dark:bg-white/5 rounded-xl mb-4">
                        <button 
                            onClick={() => setActiveTab('active')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white dark:bg-surface-dark text-[#111618] dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Active
                        </button>
                        <button 
                            onClick={() => setActiveTab('rented')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'rented' ? 'bg-white dark:bg-surface-dark text-[#111618] dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Rented Out
                        </button>
                        <button 
                            onClick={() => setActiveTab('drafts')}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'drafts' ? 'bg-white dark:bg-surface-dark text-[#111618] dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Drafts
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 pb-4">
                        {filteredInventory.length > 0 ? (
                            filteredInventory.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className={`relative group flex flex-col sm:flex-row gap-4 p-3 rounded-2xl bg-white dark:bg-surface-dark shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-transparent dark:border-white/5 transition-all active:scale-[0.99] cursor-pointer animate-slide-up ${vacationMode ? 'opacity-70 grayscale' : ''}`} 
                                    role="article"
                                    onClick={() => navigate('/details')}
                                    style={{ 
                                        zIndex: activeMenuId === item.id ? 30 : 'auto',
                                        animationDelay: `${index * 50}ms`
                                    }}
                                >
                                    <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                                        <img className={`h-full w-full object-cover transition-transform group-hover:scale-110 duration-500 ${item.status === 'Rented' ? 'grayscale' : item.status === 'Draft' ? 'opacity-70' : ''}`} src={item.image} alt={item.title}/>
                                        {item.status !== 'Draft' && (
                                            <div className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border ${vacationMode ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200' : item.status === 'Available' ? 'bg-white/90 dark:bg-black/60 text-[#111618] dark:text-white border-black/5 dark:border-white/10' : 'bg-orange-100 dark:bg-orange-900/80 text-orange-700 dark:text-orange-200 border-transparent'}`}>
                                                {vacationMode ? 'Paused' : item.status}
                                            </div>
                                        )}
                                        {item.status === 'Draft' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <span className="material-symbols-outlined text-white text-3xl">edit</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between py-1">
                                        <div className="flex justify-between items-start gap-2 relative">
                                            <h4 className="font-bold text-lg dark:text-white leading-tight">{item.title}</h4>
                                            <button 
                                                onClick={(e) => toggleMenu(e, item.id)}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 -mr-2 -mt-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                aria-label="More options"
                                            >
                                                <span className="material-symbols-outlined text-xl">more_vert</span>
                                            </button>
                                            
                                            {/* Action Menu */}
                                            {activeMenuId === item.id && (
                                                <div className="absolute top-8 right-0 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fade-in origin-top-right">
                                                    <button onClick={(e) => handleMenuAction(e, 'Edit')} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                                                    </button>
                                                    {item.status !== 'Draft' && (
                                                        <button onClick={(e) => handleMenuAction(e, 'Share')} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-[18px]">share</span> Share
                                                        </button>
                                                    )}
                                                    <button onClick={(e) => handleMenuAction(e, 'Delete')} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-auto">
                                            <div className="flex items-baseline gap-1 mb-2">
                                                <p className={`${item.status === 'Rented' ? 'text-gray-500' : 'text-primary'} text-lg font-bold`}>${item.price}</p>
                                                <span className="text-gray-400 text-xs font-medium">/ day</span>
                                            </div>
                                            {item.status === 'Rented' ? (
                                                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 text-xs font-medium bg-orange-50 dark:bg-orange-900/10 px-2 py-1 rounded-md self-start w-fit">
                                                    <span className="material-symbols-outlined text-sm">schedule</span><span>Until {item.until}</span>
                                                </div>
                                            ) : item.status === 'Draft' ? (
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md self-start w-fit uppercase tracking-wider">
                                                    Not Published
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-[#617c89] dark:text-slate-400 text-xs font-medium">
                                                    <span className="material-symbols-outlined text-sm">visibility</span><span>{item.views} views this week</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
                                <p className="text-sm">No items found in {activeTab}.</p>
                                {activeTab === 'drafts' && (
                                    <button onClick={() => navigate('/upload')} className="mt-4 text-primary font-bold text-sm hover:underline">
                                        Create a Listing
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <BottomNav active="listings" />
        </div>
    );
};

export default DashboardScreen;
