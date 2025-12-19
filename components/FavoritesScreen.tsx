import React from 'react';
import { useNavigate } from 'react-router-dom';

const FavoritesScreen: React.FC = () => {
    const navigate = useNavigate();

    const favorites = [
         {
            id: 1,
            title: "DeWalt 20V Max Cordless Drill",
            category: "Power Tools",
            distance: "0.8 mi",
            rating: 4.8,
            reviews: 12,
            price: 15,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe6Wcs7CcKOtPxjafC55ogztY2wJ8xLE0vBvtYnW-5OQXxVdVlxElKh61XV-kCRxANw6JxdCigI6Xflf49KuKwluJqIR3a6UMLsA2ri1_4aSQzxppoY8qRtd03DBcFzPtgCyTnbSLDzpaQVLLzDKosoSkOi0Pqcta8vCABc4hZhum1xqf4ax-eUDYI1Ki-j6UoxJZmxC6qRCqvBHA2ppGhE7y4wEHiMLM05h-PYtvG3xBeqZEQcnPQ9swZQukIWjg8N_5m0GcCI94I",
        },
        {
            id: 3,
            title: "Makita Angle Grinder",
            category: "Power Tools",
            distance: "2.5 mi",
            rating: 4.7,
            reviews: 8,
            price: 40,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQCnxcTiY5nKrKkYNtVae8ksL-Qvss7nooNMjfbB1JM2WRRrZjWNpbS7cixDmYPOSqUqORPLNIdJ7kC14bNjFIrhkBoNwBpRxo36Yhu5IIz0BGr-rMAm66_afFSyL9jwTP7-ie9g5puePG7KgMTLX9wF16_0uYkWPaO2tbZj3unr6_CyepmSQOxPbDFSRynQqNoHDOSMLa5GNcXNHMZgNWyDMjwLyJjlfNe2A6IUYwSfdDn4nBHipdRTLKZMtnPD_5GjNkhwDcD66h",
        },
        {
             id: 5,
             title: "Extension Ladder 24ft",
             category: "Hardware",
             distance: "4.1 mi",
             rating: 4.9,
             reviews: 30,
             price: 20,
             image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in">
             <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Favorites</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {favorites.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => navigate('/details')}
                        className="bg-white dark:bg-surface-dark rounded-xl p-3 flex gap-4 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                    >
                         <div className="w-24 h-24 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                            <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${item.image}')`}}></div>
                        </div>
                        <div className="flex flex-col flex-1 justify-between py-1 min-w-0">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white leading-tight truncate">{item.title}</h3>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mt-1">
                                    <span>{item.category}</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px] text-yellow-500 fill-current">star</span>
                                            <span>{item.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-slate-900 dark:text-white font-bold text-lg">${item.price}</span>
                                    <span className="text-slate-400 text-xs">/ day</span>
                                </div>
                                <button className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500">
                                     <span className="material-symbols-outlined text-xl fill-current">favorite</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">You have {favorites.length} saved items.</p>
                </div>
            </div>
        </div>
    );
};

export default FavoritesScreen;