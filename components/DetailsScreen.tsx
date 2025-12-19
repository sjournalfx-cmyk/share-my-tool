
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DetailsScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Core State
    const [liked, setLiked] = useState(false);
    const [bookingType, setBookingType] = useState<'rental' | 'service'>('rental');
    
    // Interactive State
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Mock Data
    const images = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDe6Wcs7CcKOtPxjafC55ogztY2wJ8xLE0vBvtYnW-5OQXxVdVlxElKh61XV-kCRxANw6JxdCigI6Xflf49KuKwluJqIR3a6UMLsA2ri1_4aSQzxppoY8qRtd03DBcFzPtgCyTnbSLDzpaQVLLzDKosoSkOi0Pqcta8vCABc4hZhum1xqf4ax-eUDYI1Ki-j6UoxJZmxC6qRCqvBHA2ppGhE7y4wEHiMLM05h-PYtvG3xBeqZEQcnPQ9swZQukIWjg8N_5m0GcCI94I",
        "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1932&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1780&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=1974&auto=format&fit=crop"
    ];

    const reviews = [
        { id: 1, name: "Mike T.", date: "Oct 12", rating: 5, text: "Great drill, batteries lasted all day. Sarah was super helpful with pickup." },
        { id: 2, name: "Jenny L.", date: "Sep 28", rating: 5, text: "Exactly what I needed for my shelf project. Clean and fully charged." }
    ];

    const features = [
        { icon: 'bolt', label: '20V Max' },
        { icon: 'battery_charging_full', label: '2 Batteries' },
        { icon: 'work', label: 'Case Included' },
        { icon: 'speed', label: 'High Speed' }
    ];

    // Calendar Mock
    const [dateRange, setDateRange] = useState<{start: number | null, end: number | null}>({start: 0, end: 1});
    const days = Array.from({length: 14}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            index: i,
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            available: ![2, 3, 8, 9].includes(i)
        };
    });

    // Navigation Handler
    const handleBack = () => {
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate('/map');
        }
    };

    // Toast Helper
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'DeWalt 20V Max Cordless Drill',
                text: 'Check out this tool on ToolPool!',
                url: window.location.href,
            }).catch(() => showToast("Link copied to clipboard"));
        } else {
            showToast("Link copied to clipboard");
        }
    };

    const toggleLike = () => {
        setLiked(!liked);
        showToast(liked ? "Removed from Favorites" : "Added to Favorites");
    };

    // Swipe Handlers
    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50 && currentImageIndex < images.length - 1) setCurrentImageIndex(prev => prev + 1);
        if (distance < -50 && currentImageIndex > 0) setCurrentImageIndex(prev => prev - 1);
        setTouchStart(0);
        setTouchEnd(0);
    };

    // Calendar Logic
    const handleDateClick = (idx: number) => {
        if (!days[idx].available) return;
        
        // Reset if range is complete or clicking before start
        if ((dateRange.start !== null && dateRange.end !== null) || (dateRange.start !== null && idx < dateRange.start)) {
            setDateRange({ start: idx, end: null });
        } else if (dateRange.start === null) {
            setDateRange({ start: idx, end: null });
        } else {
            setDateRange(prev => ({ ...prev, end: idx }));
        }
    };

    const isDaySelected = (idx: number) => {
        if (dateRange.start === idx) return 'start';
        if (dateRange.end === idx) return 'end';
        if (dateRange.start !== null && dateRange.end !== null && idx > dateRange.start && idx < dateRange.end) return 'middle';
        return null;
    };

    // Pricing Calculation
    const baseRate = bookingType === 'rental' ? 15 : 45; // $15 rental, $45 service
    const duration = (dateRange.start !== null && dateRange.end !== null) 
        ? (dateRange.end - dateRange.start + 1) 
        : 1;
    const total = baseRate * duration;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col relative animate-fade-in">
            
            {/* Toast Notification */}
            {toastMessage && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[60] animate-fade-in w-max max-w-[90%] pointer-events-none">
                    <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-slate-900 px-4 py-3 rounded-xl text-sm font-medium shadow-xl flex items-center gap-2">
                         <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                         {toastMessage}
                    </div>
                </div>
            )}

            {/* Fixed Header */}
            <div className="absolute top-0 left-0 w-full z-20 p-4 pt-safe flex justify-between items-start pointer-events-none">
                <button 
                    onClick={handleBack} 
                    className="size-10 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-slate-900 dark:text-white shadow-sm pointer-events-auto active:scale-95 transition-transform hover:bg-white dark:hover:bg-black"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex gap-3 pointer-events-auto">
                    <button 
                        onClick={handleShare}
                        className="size-10 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-slate-900 dark:text-white shadow-sm active:scale-95 transition-transform hover:bg-white dark:hover:bg-black"
                    >
                        <span className="material-symbols-outlined">share</span>
                    </button>
                    <button 
                        onClick={toggleLike}
                        className="size-10 rounded-full bg-white/70 dark:bg-black/50 backdrop-blur-md flex items-center justify-center shadow-sm active:scale-90 transition-transform hover:bg-white dark:hover:bg-black"
                    >
                        <span className={`material-symbols-outlined ${liked ? 'fill-red-500 text-red-500' : 'text-slate-900 dark:text-white'}`}>favorite</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                
                {/* Image Gallery */}
                <div 
                    className="relative w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="w-full h-full flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                        {images.map((img, i) => (
                            <img key={i} src={img} className="w-full h-full object-cover shrink-0" alt={`View ${i + 1}`} />
                        ))}
                    </div>
                    
                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, i) => (
                            <div key={i} className={`size-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                        ))}
                    </div>
                    
                    {/* Image Counter Badge */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-md">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                </div>

                <div className="px-5 pt-6">
                    {/* Title & Rating */}
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-bold leading-tight max-w-[80%]">DeWalt 20V Max Cordless Drill</h1>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-bold text-primary">${baseRate}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ day</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                         <div className="flex items-center gap-1 text-sm font-bold">
                            <span className="material-symbols-outlined text-amber-400 text-lg fill-current">star</span>
                            <span>4.9</span>
                            <span className="text-slate-400 font-normal underline decoration-slate-300 decoration-dotted ml-1">12 reviews</span>
                         </div>
                         <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
                         <span className="text-sm text-slate-500 dark:text-slate-400">0.8 mi away</span>
                    </div>

                    {/* Owner Card */}
                    <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800 mb-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-xl bg-slate-200 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop')"}}></div>
                            <div>
                                <p className="font-bold text-sm">Sarah M.</p>
                                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                                    <span>Verified Owner</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/chat'); }} className="size-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary active:scale-95 transition-transform">
                            <span className="material-symbols-outlined">chat_bubble</span>
                        </button>
                    </div>

                    {/* Tabs / Mode Switcher */}
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex mb-6">
                        <button 
                            onClick={() => { setBookingType('rental'); setDateRange({start: 0, end: 1}); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${bookingType === 'rental' ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Rent Tool
                        </button>
                        <button 
                            onClick={() => { setBookingType('service'); setDateRange({start: 0, end: 0}); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${bookingType === 'service' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">engineering</span>
                            Request Service
                        </button>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-2">Description</h3>
                        <p className={`text-slate-600 dark:text-slate-300 text-sm leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>
                            Versatile and powerful DeWalt 20V Max Cordless Drill. Perfect for home repairs, drilling into wood, metal, or plastic. Comes with two fully charged batteries and a charger, so you can work all day without interruption. Lightweight design minimizes fatigue during extended use.
                        </p>
                        <button 
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="text-primary text-sm font-bold mt-1"
                        >
                            {isDescriptionExpanded ? 'Show less' : 'Read more'}
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl">
                                <span className="material-symbols-outlined text-slate-400">{feat.icon}</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{feat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Calendar / Availability */}
                    <div className="mb-8">
                         <div className="flex justify-between items-end mb-4">
                            <h3 className="font-bold text-lg">Availability</h3>
                            <span className="text-xs text-slate-400">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                            {days.map((d, i) => {
                                const status = isDaySelected(i);
                                return (
                                    <button 
                                        key={i}
                                        disabled={!d.available}
                                        onClick={() => handleDateClick(i)}
                                        className={`
                                            min-w-[60px] h-[72px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all border
                                            ${!d.available ? 'bg-slate-50 dark:bg-white/5 border-transparent opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                            ${status === 'start' ? 'bg-primary text-white border-primary shadow-lg scale-105 z-10' : ''}
                                            ${status === 'end' ? 'bg-primary text-white border-primary shadow-lg scale-105 z-10' : ''}
                                            ${status === 'middle' ? 'bg-primary/10 border-primary/10 text-primary rounded-none border-x-0' : ''}
                                            ${!status && d.available ? 'bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-primary/50' : ''}
                                        `}
                                    >
                                        <span className={`text-[10px] font-bold uppercase ${status === 'start' || status === 'end' ? 'text-white/80' : 'text-slate-400'}`}>{d.day}</span>
                                        <span className="text-lg font-bold">{d.date}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reviews Preview */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Reviews (12)</h3>
                            <button className="text-primary text-sm font-bold">View All</button>
                        </div>
                        <div className="space-y-3">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                {review.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-sm text-slate-900 dark:text-white">{review.name}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{review.date}</span>
                                    </div>
                                    <div className="flex text-amber-400 mb-2">
                                        {[...Array(review.rating)].map((_, i) => <span key={i} className="material-symbols-outlined text-sm fill-current">star</span>)}
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">"{review.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="absolute bottom-0 left-0 w-full bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-4 pb-8 safe-area-pb z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                         <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total for {duration} day{duration > 1 ? 's' : ''}</p>
                         <div className="flex items-baseline gap-1">
                             <span className="text-2xl font-black text-slate-900 dark:text-white">${total}</span>
                             {bookingType === 'rental' && <span className="text-xs text-slate-400 line-through">${total + 5}</span>}
                         </div>
                    </div>
                    <button 
                        onClick={() => navigate('/booking', { state: { bookingType, rate: baseRate } })}
                        className={`flex-1 h-14 font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${bookingType === 'service' ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30' : 'bg-primary hover:bg-primary-dark text-white shadow-primary/30'}`}
                    >
                        <span>{bookingType === 'service' ? 'Request Service' : 'Rent Now'}</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailsScreen;
