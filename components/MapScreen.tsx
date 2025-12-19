
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { searchPlaces, PlaceResult } from '../services/geminiService';

declare global {
  interface Window {
    google: any;
    gm_authFailure?: () => void;
  }
}

interface Listing {
    id: number;
    title: string;
    category: string;
    distance: string;
    rating: number;
    reviews: number;
    price: number;
    image: string;
    ownerImage: string;
    ownerName: string;
    lat: number;
    lng: number;
    mockPosition: { top: string; left: string };
    hasService?: boolean;
}

// Map Styles (kept similar but ensured compatibility with new theme)
const mapStyleLight = [
    { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "elementType": "labels", "stylers": [{ "visibility": "off" }] }
];

const mapStyleDark = [
    { "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] }, // Slate 800
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1e293b" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] }, // Slate 400
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#334155" }] }, // Slate 700
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0f172a" }] }, // Slate 900
];

const MapScreen: React.FC = () => {
    const navigate = useNavigate();
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [mapError, setMapError] = useState(false);
    const [locating, setLocating] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Mock Data
    const listings: Listing[] = [
        {
            id: 1,
            title: "DeWalt 20V Max Cordless Drill",
            category: "Power Tools",
            distance: "0.8 mi",
            rating: 4.8,
            reviews: 12,
            price: 15,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdsuRsBAlRCBVjrcjyHNCU9DoOhmFP4r6Lr0TQsvezESoATSAYzTZgmH_MhUvqwISu4Exxclcza761aj2tLo0Vp0wLhy4x-eB0GgxCLtHD4E9EiBZ7kjDP6uxg2Ywfxlhsj6khBWQRLj8BSD8TUiRthPQQujvsYLNNxm5607-q1CZ3CZyr4XNw89BFOg3pPkgbDTenyaZPtUZZRBSLyVnt2kdA-FF0_mcpJg0fskPJkjAtW6JF3OfDuGrTRGiwDnqjCF5gIZdYsCRO",
            ownerImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
            ownerName: "Mike",
            lat: 37.7600,
            lng: -122.4200,
            mockPosition: { top: '45%', left: '50%' },
            hasService: true
        },
        {
            id: 2,
            title: "Bosch 18V Circular Saw",
            category: "Power Tools",
            distance: "1.2 mi",
            rating: 4.9,
            reviews: 28,
            price: 25,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBefBvpWZSN4SUVMn7ibyHshD4pAkp3yzyZfwLk6LawaALYcxz_MgWOsWVz63-JqLckR2ilSCbbYclJI2aETnQN6mDAKKRbj-bib-VC5mnooUU2bMVjfnWTP72QnoOazo14fWVHaZ_KvV8JMd8aMFX5vwTtrhppPz66OhGp6kIiRlYa04J_wbBwFxUZjC2evahiP9OGyGRGC1JbT6zHdAiPV08Ir1rnqZl8HDNFG7oSji7z8qChks2XaN0kyH6iPqY8878XQws0mXJJ",
            ownerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
            ownerName: "Sarah",
            lat: 37.7500,
            lng: -122.4100,
            mockPosition: { top: '60%', left: '65%' }
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
            ownerImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
            ownerName: "Dave",
            lat: 37.7800,
            lng: -122.4300,
            mockPosition: { top: '30%', left: '35%' },
            hasService: true
        },
        {
            id: 4,
            title: "Pressure Washer 3000PSI",
            category: "Cleaning",
            distance: "3.1 mi",
            rating: 4.5,
            reviews: 42,
            price: 85,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArpF3ROoh7UKbbsHugDaYhONZK38MIfiTpV2CFV9XxWzI1V2UhnVxhzoN6i2TuOh4jF_kaeDMbMvG_ij_pjpzCUtkiyz7mlqXLK5jtrpt6cFrKn0nRTXz8U4Y1ok_75ybOt4qyUiybG8z12ZLGXH4OIEB80ykIfjpfztshNv7dPTelYNnbCA6wkk-x-B-jpLpdX6EMr2X70kRmRab3K2UgpwZRjJSIgGcKrgdoCKxqpEa74tqMEw-qTc3jvOgo6I-3pRkGYwBtBCjo",
            ownerImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop",
            ownerName: "Steve",
            lat: 37.7400,
            lng: -122.4000,
            mockPosition: { top: '70%', left: '75%' },
            hasService: true
        }
    ];

    // Filter Logic
    const filteredListings = listings.filter(l => {
        if (activeCategory === 'All') return true;
        if (activeCategory === 'Services') return l.hasService;
        return l.category === activeCategory;
    });
    
    const selectedListing = listings.find(l => l.id === selectedListingId);

    // Map Initialization
    const loadGoogleMaps = () => {
        // If API Key is missing or "undefined", fail fast
        if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
            return Promise.reject("Missing API Key");
        }

        if (window.google?.maps) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&libraries=places`;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const isDarkMode = document.documentElement.classList.contains('dark');

    useEffect(() => {
        // Setup Auth Failure Handler FIRST
        window.gm_authFailure = () => {
            console.warn("Google Maps API Key Invalid or Missing permissions. Switching to Interactive Mock Mode.");
            setMapError(true);
        };

        loadGoogleMaps().then(() => {
            if (!mapRef.current || googleMapRef.current) return;
            try {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 37.7600, lng: -122.4200 },
                    zoom: 13,
                    disableDefaultUI: true,
                    clickableIcons: false,
                    styles: isDarkMode ? mapStyleDark : mapStyleLight
                });
                googleMapRef.current = map;
                map.addListener('click', () => setSelectedListingId(null));
            } catch (error) {
                setMapError(true);
            }
        }).catch((e) => {
            console.warn("Map load failed:", e);
            setMapError(true);
        });
        
        // Clean up
        return () => { 
            // We don't remove gm_authFailure globally usually, but for cleanup:
            // window.gm_authFailure = undefined; 
        };
    }, [isDarkMode]);

    // Update Markers
    useEffect(() => {
        if (mapError) return; // Don't try to add markers if in error mode
        if (!googleMapRef.current || !window.google) return;

        // Clear
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        filteredListings.forEach(item => {
            const isSelected = selectedListingId === item.id;
            const marker = new window.google.maps.Marker({
                position: { lat: item.lat, lng: item.lng },
                map: googleMapRef.current,
                label: {
                    text: `$${item.price}`,
                    color: isSelected ? "white" : (isDarkMode ? "white" : "black"),
                    fontSize: "11px",
                    fontWeight: "bold",
                    className: "map-label"
                },
                icon: {
                    path: `M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z`,
                    fillColor: isSelected ? "#3b82f6" : (item.hasService ? "#a855f7" : (isDarkMode ? "#1e293b" : "white")),
                    fillOpacity: 1,
                    strokeColor: isSelected ? "#ffffff" : (isDarkMode ? "#475569" : "#cbd5e1"),
                    strokeWeight: 2,
                    scale: 1.5,
                    labelOrigin: new window.google.maps.Point(0, -30)
                },
                zIndex: isSelected ? 100 : 1
            });

            marker.addListener('click', () => {
                setSelectedListingId(item.id);
                googleMapRef.current.panTo({ lat: item.lat, lng: item.lng });
            });
            markersRef.current.push(marker);
        });
    }, [filteredListings, selectedListingId, isDarkMode, mapError]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setShowResults(true);
        // Note: Using Gemini for search here, separate from Maps API
        const results = await searchPlaces(searchQuery, { lat: 37.7749, lng: -122.4194 }); 
        setSearchResults(results);
    };

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden bg-background-light dark:bg-background-dark animate-fade-in">
            
            {/* --- MAP AREA --- */}
            <div className="absolute inset-0 z-0">
                 <div ref={mapRef} className={`w-full h-full ${mapError ? 'hidden' : 'block'}`} />
                 
                 {/* Fallback Mock Map */}
                 {mapError && (
                     <div className="absolute inset-0 w-full h-full bg-[#e2e8f0] dark:bg-[#0f172a] overflow-hidden" onClick={() => setSelectedListingId(null)}>
                         {/* Abstract Roads */}
                         <div className="absolute top-[20%] left-0 w-full h-4 bg-white/50 dark:bg-white/5 rotate-3"></div>
                         <div className="absolute top-[50%] left-0 w-full h-5 bg-white/50 dark:bg-white/5 -rotate-2"></div>
                         <div className="absolute top-0 left-[30%] h-full w-5 bg-white/50 dark:bg-white/5 rotate-6"></div>
                         
                         <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                             <span className="text-4xl font-black uppercase rotate-[-30deg]">Interactive Map Demo</span>
                         </div>

                         {/* Mock Pins */}
                         {filteredListings.map(item => (
                             <button
                                key={item.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedListingId(item.id); }}
                                className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 z-10 ${selectedListingId === item.id ? 'scale-125 z-50' : 'hover:scale-110'}`}
                                style={{ top: item.mockPosition.top, left: item.mockPosition.left }}
                             >
                                 <div className={`
                                    flex flex-col items-center
                                 `}>
                                     <div className={`
                                        px-3 py-1.5 rounded-xl shadow-lg font-bold text-xs mb-1
                                        ${selectedListingId === item.id 
                                            ? 'bg-primary text-white ring-2 ring-white dark:ring-slate-800' 
                                            : item.hasService ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'}
                                     `}>
                                         ${item.price}
                                     </div>
                                     <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${selectedListingId === item.id ? 'border-t-primary' : item.hasService ? 'border-t-purple-600' : 'border-t-white dark:border-t-slate-800'}`}></div>
                                 </div>
                             </button>
                         ))}
                         
                         {/* User Pulse */}
                         <div className="absolute top-1/2 left-1/2 size-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                     </div>
                 )}
            </div>

            {/* --- LIST VIEW OVERLAY --- */}
            {viewMode === 'list' && (
                <div className="absolute inset-0 z-0 w-full h-full bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar pt-[180px] pb-24 px-4 animate-fade-in">
                    <div className="flex flex-col gap-4">
                        {filteredListings.map((tool, index) => (
                            <div 
                                key={tool.id} 
                                onClick={() => navigate('/details')} 
                                className="bg-white dark:bg-surface-dark rounded-2xl p-3 shadow-card border border-slate-100 dark:border-slate-800 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="w-28 h-28 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 relative overflow-hidden group">
                                    <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{backgroundImage: `url('${tool.image}')`}}></div>
                                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/60 backdrop-blur px-2 py-0.5 rounded-md">
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-900 dark:text-white">{tool.distance}</p>
                                    </div>
                                    {tool.hasService && (
                                        <div className="absolute bottom-2 right-2 bg-purple-600 text-white px-1.5 py-1 rounded-md shadow-lg">
                                            <span className="material-symbols-outlined text-[14px] block">engineering</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 justify-between py-1 min-w-0">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight truncate pr-2">{tool.title}</h3>
                                            <button className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">favorite</span></button>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                                             <span className="material-symbols-outlined text-[14px] text-amber-400 fill-current">star</span>
                                             <span className="font-semibold text-slate-700 dark:text-slate-300">{tool.rating}</span>
                                             <span>({tool.reviews})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border border-white dark:border-slate-600" style={{backgroundImage: `url('${tool.ownerImage}')`}}></div>
                                            <span className="text-[11px] font-medium text-slate-500">by {tool.ownerName}</span>
                                        </div>
                                         <div className="flex items-baseline gap-1">
                                            <span className="text-primary font-bold text-lg">${tool.price}</span>
                                            <span className="text-slate-400 text-xs">/ day</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- HEADER (Search & Filter) --- */}
            <div className="absolute top-0 left-0 w-full z-20 pointer-events-none pt-safe pb-4">
                <div className={`absolute inset-0 ${viewMode === 'list' ? 'bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800' : 'bg-gradient-to-b from-white/95 via-white/80 to-transparent dark:from-background-dark/95 dark:via-background-dark/80'} transition-all duration-300 backdrop-blur-sm`}></div>
                
                <div className="px-4 pt-4 pb-2 relative pointer-events-auto flex flex-col gap-3">
                    <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
                        <div className="flex-1 flex items-center rounded-2xl bg-white dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-slate-700 h-12 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                            <span className="material-symbols-outlined text-slate-400 pl-4">search</span>
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 h-full px-3 text-sm font-medium" 
                                placeholder="Search tools..." 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowFilters(!showFilters)}
                                className="h-full aspect-square flex items-center justify-center text-slate-400 hover:text-primary active:scale-90 transition-transform"
                            >
                                <span className="material-symbols-outlined">tune</span>
                            </button>
                        </div>
                    </form>
                    
                    {/* Filter Chips */}
                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide w-full pr-4">
                        {['All', 'Services', 'Power Tools', 'Cleaning', 'Gardening'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex h-8 shrink-0 items-center gap-2 rounded-full px-4 shadow-sm transition-all active:scale-95 border ${
                                    activeCategory === cat 
                                    ? cat === 'Services' ? 'bg-purple-600 text-white border-transparent' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent' 
                                    : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                <span className="text-xs font-bold whitespace-nowrap">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- FLOATING TOGGLE --- */}
            {!selectedListingId && (
                <div className={`absolute ${viewMode === 'map' ? 'bottom-[7rem]' : 'bottom-24'} left-1/2 -translate-x-1/2 z-20 pointer-events-auto transition-all duration-300`}>
                    <button 
                        onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')} 
                        className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-float font-bold text-sm hover:scale-105 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-[20px]">{viewMode === 'map' ? 'format_list_bulleted' : 'map'}</span>
                        <span>{viewMode === 'map' ? 'List' : 'Map'}</span>
                    </button>
                </div>
            )}

            {/* --- MAP PREVIEW CARD --- */}
            {(viewMode === 'map' || mapError) && selectedListingId && selectedListing && (
                <div className="absolute bottom-24 left-0 w-full px-4 z-30 pointer-events-auto">
                    <div 
                        onClick={() => navigate('/details')}
                        className="bg-white dark:bg-surface-dark rounded-3xl p-4 shadow-float border border-slate-100 dark:border-slate-700 animate-slide-up flex gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                        <div className="w-24 h-24 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                            <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${selectedListing.image}')`}}></div>
                            {selectedListing.hasService && (
                                <div className="absolute top-2 right-2 bg-purple-600 text-white px-1.5 py-1 rounded-md shadow-md">
                                    <span className="material-symbols-outlined text-[14px] block">engineering</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col flex-1 justify-between py-1 min-w-0">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight truncate">{selectedListing.title}</h3>
                                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                                    <span className="material-symbols-outlined text-[14px] text-amber-400 fill-current">star</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{selectedListing.rating}</span>
                                    <span>({selectedListing.reviews})</span>
                                    <span className="mx-1">•</span>
                                    <span>{selectedListing.distance}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-primary font-bold text-xl">${selectedListing.price}</span>
                                    <span className="text-slate-400 text-xs">/ day</span>
                                </div>
                                <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">arrow_forward</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav active="explore" />
        </div>
    );
};

export default MapScreen;
