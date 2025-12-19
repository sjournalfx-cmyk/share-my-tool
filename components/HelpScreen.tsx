import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HelpScreen: React.FC = () => {
    const navigate = useNavigate();
    const [openItem, setOpenItem] = useState<number | null>(0);

    const faqs = [
        {
            q: "How does the security deposit work?",
            a: "A security deposit is temporarily held on your card when you book. It is not a charge. The hold is released 24 hours after the tool is returned in good condition."
        },
        {
            q: "What if the tool breaks?",
            a: "If you purchased Damage Protection, accidental damage is covered up to $500. Otherwise, you may be responsible for repair costs. Please report any issues immediately."
        },
        {
            q: "How do I extend my rental?",
            a: "Go to your active rental in the Dashboard and tap 'Extend Rental'. This is subject to the owner's approval and tool availability."
        },
        {
            q: "Can I cancel my booking?",
            a: "Yes, you can cancel for a full refund up to 24 hours before the rental start time. Cancellations within 24 hours may incur a small fee."
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in">
             <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Help & Support</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-8">
                
                {/* Search */}
                <div className="relative mb-8">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400">search</span>
                    <input 
                        type="text" 
                        placeholder="Search for help..." 
                        className="w-full bg-white dark:bg-surface-dark border-none rounded-xl py-3.5 pl-12 pr-4 shadow-sm text-sm focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2 hover:border-primary/50 transition-colors">
                        <span className="material-symbols-outlined text-3xl text-blue-500">chat</span>
                        <span className="font-bold text-sm">Live Chat</span>
                    </button>
                    <button className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2 hover:border-primary/50 transition-colors">
                        <span className="material-symbols-outlined text-3xl text-green-500">mail</span>
                        <span className="font-bold text-sm">Email Us</span>
                    </button>
                </div>

                {/* FAQ */}
                <h3 className="font-bold text-lg mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                    {faqs.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
                            <button 
                                onClick={() => setOpenItem(openItem === i ? null : i)}
                                className="w-full flex justify-between items-center p-4 text-left font-semibold text-sm"
                            >
                                {item.q}
                                <span className={`material-symbols-outlined text-slate-400 transition-transform ${openItem === i ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            {openItem === i && (
                                <div className="px-4 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/50 pt-3">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm mb-2">Still need help?</p>
                    <button className="text-primary font-bold text-sm hover:underline">Visit Help Center</button>
                </div>
            </div>
        </div>
    );
};

export default HelpScreen;