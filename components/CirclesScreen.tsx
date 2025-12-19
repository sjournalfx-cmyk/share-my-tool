import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CirclesScreen: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'my-circles' | 'discover'>('my-circles');

    const myCircles = [
        {
            id: 1,
            name: "Mission District DIY",
            members: 142,
            role: "Member",
            image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
            benefits: ["No Security Deposit", "Priority Booking"]
        },
        {
            id: 2,
            name: "SF Woodworkers Guild",
            members: 85,
            role: "Admin",
            image: "https://images.unsplash.com/photo-1622675363311-ac97f3a9a344?q=80&w=2070&auto=format&fit=crop",
            benefits: ["10% Discount", "Tool Insurance Included"]
        }
    ];

    const discoverCircles = [
        {
            id: 3,
            name: "Greenwood HOA",
            members: 45,
            image: "https://images.unsplash.com/photo-1558036117-15db527a5669?q=80&w=2070&auto=format&fit=crop",
            desc: "Private group for Greenwood residents."
        },
        {
            id: 4,
            name: "Bay Area Gardeners",
            members: 320,
            image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1932&auto=format&fit=crop",
            desc: "Community gardening equipment sharing."
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in relative">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Neighborhood Circles</h2>
                <button className="ml-auto text-primary font-bold text-2xl">
                    <span className="material-symbols-outlined">add_circle</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="px-4 py-4">
                <div className="bg-gray-200 dark:bg-white/10 p-1 rounded-xl flex">
                    <button 
                        onClick={() => setActiveTab('my-circles')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'my-circles' ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        My Circles
                    </button>
                    <button 
                        onClick={() => setActiveTab('discover')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'discover' ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        Discover
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-4">
                {activeTab === 'my-circles' ? (
                    <>
                         <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-4 rounded-2xl flex gap-3 items-start">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">verified_user</span>
                            <div>
                                <h3 className="font-bold text-sm text-blue-900 dark:text-blue-100">Trust Matters</h3>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Rentals within your circles often have lower deposits and exclusive discounts because of higher community trust.</p>
                            </div>
                        </div>

                        {myCircles.map(circle => (
                            <div key={circle.id} className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group cursor-pointer active:scale-[0.99] transition-transform">
                                <div className="h-28 w-full bg-cover bg-center relative" style={{backgroundImage: `url('${circle.image}')`}}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <h3 className="font-bold text-lg leading-tight">{circle.name}</h3>
                                        <p className="text-xs opacity-90">{circle.members} Members • {circle.role}</p>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Circle Benefits</p>
                                    <div className="flex flex-wrap gap-2">
                                        {circle.benefits.map((benefit, i) => (
                                            <span key={i} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-md border border-green-100 dark:border-green-900/30">
                                                {benefit}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <div className="relative mb-2">
                            <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">search</span>
                            <input type="text" placeholder="Search for groups..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none" />
                        </div>

                        {discoverCircles.map(circle => (
                            <div key={circle.id} className="bg-white dark:bg-surface-dark rounded-2xl p-3 flex gap-4 shadow-sm border border-slate-100 dark:border-slate-800 items-center">
                                <div className="size-16 rounded-xl bg-cover bg-center shrink-0" style={{backgroundImage: `url('${circle.image}')`}}></div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate">{circle.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{circle.desc}</p>
                                    <p className="text-xs text-slate-400 mt-1">{circle.members} Members</p>
                                </div>
                                <button className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-xs font-bold transition-colors">
                                    Request
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default CirclesScreen;