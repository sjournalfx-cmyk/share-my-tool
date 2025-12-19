
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// --- Wheel Picker Helper Component ---
const WheelColumn: React.FC<{ 
    options: { label: string, value: string | number }[], 
    value: string | number, 
    onChange: (val: string | number) => void 
}> = ({ options, value, onChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemHeight = 44; // Height of each item in px

    useEffect(() => {
        if (containerRef.current) {
            const index = options.findIndex(o => o.value === value);
            if (index !== -1) {
                containerRef.current.scrollTop = index * itemHeight;
            }
        }
    }, []); // Run once on mount to set initial position

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        if (options[index] && options[index].value !== value) {
            onChange(options[index].value);
        }
    };

    return (
        <div className="h-[220px] relative w-full overflow-hidden font-display group">
            <div 
                ref={containerRef}
                className="wheel-scroller h-full w-full overflow-y-auto no-scrollbar py-[88px]" 
                onScroll={handleScroll}
            >
                {options.map((opt) => (
                    <div 
                        key={opt.value} 
                        className={`wheel-item h-[44px] flex items-center justify-center transition-all duration-200 ${opt.value === value ? 'text-white font-bold scale-110' : 'text-slate-500 font-medium scale-90 opacity-60'}`}
                    >
                        {opt.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Mock Tool Data ---
const TOOL_DETAILS = {
    title: "DeWalt 20V Max Cordless Drill",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1780&auto=format&fit=crop",
    ownerName: "Sarah M.",
    ownerImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    rating: 4.9,
    baseRate: 15
};

// --- Main Booking Screen ---
const BookingScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Config from previous screen
    const bookingType = location.state?.bookingType || 'rental'; // 'rental' or 'service'
    const rate = location.state?.rate || TOOL_DETAILS.baseRate;
    
    // State
    const [handoverMethod, setHandoverMethod] = useState<'pickup' | 'meetup' | 'delivery'>('pickup');
    const [address, setAddress] = useState('');
    const [insurance, setInsurance] = useState(true);
    const [message, setMessage] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Custom Date State
    const today = new Date();
    const [startDateTime, setStartDateTime] = useState(new Date(today.getTime() + 3600000)); // +1 hour
    const [endDateTime, setEndDateTime] = useState(new Date(today.getTime() + 86400000)); // +1 day for rental
    const [serviceDuration, setServiceDuration] = useState(2); // Hours
    
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');
    
    // Temp state for picker (committed only on "Set")
    const [tempDate, setTempDate] = useState(new Date());

    // Payment Method State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState('4242');

    const paymentMethods = [
        { id: '4242', type: 'Visa', label: 'Visa ending in 4242', icon: 'credit_card', brandIcon: 'payments' },
        { id: '8822', type: 'Mastercard', label: 'Mastercard ending in 8822', icon: 'credit_card', brandIcon: 'payments' },
        { id: 'apple', type: 'Apple Pay', label: 'Apple Pay', icon: 'account_balance_wallet', brandIcon: 'account_balance' }
    ];

    const activePayment = paymentMethods.find(p => p.id === selectedCardId) || paymentMethods[0];
    
    // Pricing Logic
    const diffTime = Math.max(0, endDateTime.getTime() - startDateTime.getTime());
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    // Service Pricing
    const serviceTotal = bookingType === 'service' ? (serviceDuration * rate) : 0;
    const rentalTotal = bookingType === 'rental' ? (days * rate) : 0;
    
    const deliveryFee = (bookingType === 'rental' && handoverMethod === 'delivery') ? 15.00 : 0;
    const travelFee = (bookingType === 'service') ? 10.00 : 0;
    const insuranceFee = 3.00;
    const insuranceTotal = (insurance && bookingType === 'rental') ? insuranceFee : 0; 
    
    const subtotal = bookingType === 'service' ? (serviceTotal + travelFee) : (rentalTotal + deliveryFee + insuranceTotal);
    const serviceFee = subtotal * 0.10;
    const totalDue = subtotal + serviceFee;

    const openPicker = (mode: 'start' | 'end') => {
        setPickerMode(mode);
        setTempDate(mode === 'start' ? new Date(startDateTime) : new Date(endDateTime));
        setIsPickerOpen(true);
    };

    const confirmDate = () => {
        if (pickerMode === 'start') {
            setStartDateTime(new Date(tempDate));
            if (bookingType === 'rental' && tempDate > endDateTime) {
                setEndDateTime(new Date(tempDate.getTime() + 86400000));
            }
        } else {
            // End date picker only for rental
            if (tempDate < startDateTime) {
                setEndDateTime(new Date(startDateTime.getTime() + 3600000));
            } else {
                setEndDateTime(new Date(tempDate));
            }
        }
        setIsPickerOpen(false);
    };

    const handleBooking = () => {
        if ((handoverMethod === 'delivery' || handoverMethod === 'meetup' || bookingType === 'service') && !address.trim()) {
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => navigate('/verify'), 1500);
        }, 1500);
    };

    // --- Date Formatting Helpers ---
    const formatDate = (date: Date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formatTime = (date: Date) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    // --- Picker Data Generation ---
    const years = Array.from({length: 5}, (_, i) => {
        const y = today.getFullYear() + i;
        return { label: y.toString(), value: y };
    });

    const months = Array.from({length: 12}, (_, i) => {
        const d = new Date(2024, i, 1);
        return { label: d.toLocaleDateString('en-US', { month: 'short' }), value: i };
    });

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const daysArr = Array.from({ length: daysInMonth(tempDate.getFullYear(), tempDate.getMonth()) }, (_, i) => {
        return { label: (i + 1).toString().padStart(2, '0'), value: i + 1 };
    });

    const hoursArr = Array.from({length: 24}, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));
    const minutesArr = Array.from({length: 12}, (_, i) => ({ label: (i * 5).toString().padStart(2, '0'), value: i * 5 }));

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white h-full flex flex-col animate-fade-in relative overflow-hidden">
            
            {/* Header */}
            <div className="shrink-0 flex items-center bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 py-3 justify-between border-b border-gray-200 dark:border-gray-800 transition-colors z-40">
                <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">{bookingType === 'service' ? 'Service Request' : 'Booking Request'}</h2>
                <div className="w-10"></div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <main className="px-4 py-6 flex flex-col gap-6 pb-32">
                    
                    {/* 1. Item Summary Card */}
                    <section className="bg-white dark:bg-surface-dark rounded-2xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
                            <img src={TOOL_DETAILS.image} alt="Tool" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-white truncate">{TOOL_DETAILS.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                 <div className="flex items-center gap-1">
                                    <div className="size-4 rounded-full bg-slate-200 bg-cover bg-center" style={{backgroundImage: `url('${TOOL_DETAILS.ownerImage}')`}}></div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{TOOL_DETAILS.ownerName}</span>
                                </div>
                                <span className="text-slate-300 dark:text-slate-600 text-[10px]">•</span>
                                {bookingType === 'service' ? (
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded">Operator</span>
                                ) : (
                                    <div className="flex items-center gap-0.5">
                                        <span className="material-symbols-outlined text-amber-400 text-[12px] fill-current">star</span>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{TOOL_DETAILS.rating}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 2. Service-Specific: Job Location & Task */}
                    {bookingType === 'service' && (
                        <>
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Service Details</h3>
                                <div className="space-y-4">
                                    {/* Job Location Input */}
                                    <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-4">
                                        <label className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wide mb-2 block">Job Location (Required)</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-3 top-3.5 text-purple-500">location_on</span>
                                            <input 
                                                type="text" 
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="e.g. 123 Main St, Apt 4B"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/50 focus:ring-2 focus:ring-purple-500 outline-none text-sm text-slate-900 dark:text-white font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Date & Time Selection for Service */}
                                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 block">When do you need help?</label>
                                        <div className="flex gap-3 mb-4">
                                            <button 
                                                onClick={() => openPicker('start')}
                                                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-left hover:border-primary transition-all group"
                                            >
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Date & Time</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary text-xl">event</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(startDateTime)}</p>
                                                        <p className="text-xs font-medium text-slate-500">{formatTime(startDateTime)}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>

                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 block">Estimated Duration</label>
                                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                            {[1, 2, 3, 4, 5, 6, 8].map(h => (
                                                <button
                                                    key={h}
                                                    onClick={() => setServiceDuration(h)}
                                                    className={`min-w-[60px] py-3 rounded-xl font-bold text-sm border transition-all ${serviceDuration === h ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                                >
                                                    {h}h
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Task Description */}
                                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Task Details</label>
                                        <textarea 
                                            value={taskDescription}
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            placeholder="Describe what needs to be done..."
                                            className="w-full h-32 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm resize-none dark:text-white placeholder:text-slate-400"
                                        ></textarea>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    {/* 3. Rental-Specific: Dates, Handover, Protection */}
                    {bookingType === 'rental' && (
                        <>
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold dark:text-white">Dates</h3>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                        {days} Day{days > 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => openPicker('start')}
                                        className="flex-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-left hover:border-primary transition-all active:scale-[0.98] relative overflow-hidden group shadow-sm"
                                    >
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Start</p>
                                        <p className="text-base font-bold text-slate-900 dark:text-white">{formatDate(startDateTime)}</p>
                                        <p className="text-sm font-medium text-slate-400 group-hover:text-primary transition-colors">{formatTime(startDateTime)}</p>
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                    </button>

                                    <span className="material-symbols-outlined text-slate-300">arrow_forward</span>

                                    <button 
                                        onClick={() => openPicker('end')}
                                        className="flex-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-3 rounded-2xl text-left hover:border-primary transition-all active:scale-[0.98] relative overflow-hidden group shadow-sm"
                                    >
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">End</p>
                                        <p className="text-base font-bold text-slate-900 dark:text-white">{formatDate(endDateTime)}</p>
                                        <p className="text-sm font-medium text-slate-400 group-hover:text-primary transition-colors">{formatTime(endDateTime)}</p>
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-400 group-hover:bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                    </button>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Handover</h3>
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-1.5 shadow-sm border border-slate-100 dark:border-slate-800 flex mb-4">
                                    {['pickup', 'meetup', 'delivery'].map((method) => (
                                        <button 
                                            key={method}
                                            onClick={() => {
                                                setHandoverMethod(method as any);
                                                setAddress('');
                                            }}
                                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all capitalize ${handoverMethod === method ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 transition-all">
                                    {handoverMethod === 'pickup' ? (
                                        <div className="flex gap-4">
                                            <div className="h-20 w-20 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden relative shrink-0">
                                                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Mission+District,San+Francisco,CA&zoom=13&size=200x200&style=feature:all|element:labels|visibility:off&key=YOUR_API_KEY')] bg-cover bg-center opacity-60"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="size-6 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                                                        <div className="size-3 bg-primary rounded-full border-2 border-white"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">Mission District, SF</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                    Approximate location. The exact address will be shared after booking is confirmed.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="animate-fade-in">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                                                {handoverMethod === 'delivery' ? "Delivery Address" : "Suggested Location"}
                                            </label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">location_on</span>
                                                <input 
                                                    type="text" 
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    placeholder="Enter address"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none text-sm text-slate-900 dark:text-white"
                                                />
                                            </div>
                                            {handoverMethod === 'delivery' && (
                                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">info</span>
                                                    Delivery fee applies: ${deliveryFee.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section 
                                onClick={() => setInsurance(!insurance)}
                                className={`rounded-2xl p-4 border transition-all cursor-pointer flex items-center gap-4 ${insurance ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700'}`}
                            >
                                <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${insurance ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                    {insurance && <span className="material-symbols-outlined text-white text-xs">check</span>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-sm dark:text-white">Damage Protection</span>
                                        <span className="font-bold text-sm text-primary">$3.00</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Coverage up to $500 for accidental damage.</p>
                                </div>
                            </section>
                        </>
                    )}

                    {/* 6. Payment Method */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Payment</h3>
                        <div 
                            className="flex items-center gap-3 p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer active:scale-[0.99] transition-transform shadow-sm" 
                            onClick={() => setShowPaymentModal(true)}
                        >
                            <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300">
                                 <span className="material-symbols-outlined">{activePayment.brandIcon}</span>
                            </div>
                            <div className="flex-1">
                                 <p className="text-sm font-bold text-slate-900 dark:text-white">{activePayment.type}</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">{activePayment.label}</p>
                            </div>
                            <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-md">Change</span>
                        </div>
                    </section>

                    {/* 8. Price Breakdown */}
                    <section className="bg-slate-100 dark:bg-surface-dark rounded-2xl p-5">
                        <div className="space-y-3 text-sm">
                            {bookingType === 'service' ? (
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Labor ({serviceDuration} hrs @ ${rate}/hr)</span>
                                    <span>${serviceTotal.toFixed(2)}</span>
                                </div>
                            ) : (
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Rental ({days} days @ ${rate}/day)</span>
                                    <span>${rentalTotal.toFixed(2)}</span>
                                </div>
                            )}
                            
                            {bookingType === 'service' && travelFee > 0 && (
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Travel Fee</span>
                                    <span>${travelFee.toFixed(2)}</span>
                                </div>
                            )}
                            
                            {bookingType === 'rental' && handoverMethod === 'delivery' && (
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Delivery Fee</span>
                                    <span>${deliveryFee.toFixed(2)}</span>
                                </div>
                            )}
                            
                            {bookingType === 'rental' && insurance && (
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Protection</span>
                                    <span>${insuranceFee.toFixed(2)}</span>
                                </div>
                            )}
                            
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Service Fee</span>
                                <span>${serviceFee.toFixed(2)}</span>
                            </div>
                            
                            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                            <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                                <span>Total</span>
                                <span>${totalDue.toFixed(2)}</span>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="shrink-0 absolute bottom-0 left-0 w-full bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-4 pb-8 safe-area-pb z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={handleBooking}
                    disabled={isSubmitting || (bookingType === 'service' && !address.trim()) || (bookingType === 'rental' && handoverMethod !== 'pickup' && !address.trim())}
                    className={`w-full h-14 font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${
                        isSubmitting || (bookingType === 'service' && !address.trim()) || (bookingType === 'rental' && handoverMethod !== 'pickup' && !address.trim())
                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                        : bookingType === 'service' ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25' : 'bg-primary hover:bg-primary-dark text-white shadow-primary/25'
                    }`}
                >
                    {isSubmitting ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span>{bookingType === 'service' ? 'Request Service' : 'Request to Book'}</span>
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </>
                    )}
                </button>
            </div>

            {/* Date/Time Picker Modal */}
            {isPickerOpen && (
                <div className="absolute inset-0 z-[60] flex items-end">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsPickerOpen(false)}
                    ></div>
                    <div className="relative w-full bg-[#1c1c1e] text-white rounded-t-3xl animate-slide-up overflow-hidden safe-area-pb shadow-2xl border-t border-white/10">
                        <div className="w-full flex justify-center pt-3 pb-1">
                            <div className="w-12 h-1.5 bg-gray-600 rounded-full"></div>
                        </div>
                        <div className="px-6 pb-4 pt-2">
                             <h3 className="text-2xl font-bold font-display text-center">
                                {pickerMode === 'start' ? (bookingType === 'service' ? 'Service Date & Time' : 'Start Date & Time') : 'End Date & Time'}
                            </h3>
                        </div>
                        <div className="relative h-[220px] w-full flex justify-center px-4">
                            <div className="absolute top-[88px] left-4 right-4 h-[44px] bg-white/10 rounded-xl pointer-events-none z-0 border border-white/10"></div>
                            
                            <div className="flex-1 z-10 text-center">
                                <WheelColumn 
                                    options={daysArr} 
                                    value={tempDate.getDate()} 
                                    onChange={(val) => {
                                        const d = new Date(tempDate);
                                        d.setDate(Number(val));
                                        setTempDate(d);
                                    }}
                                />
                            </div>
                             <div className="flex-1 z-10 text-center">
                                <WheelColumn 
                                    options={months} 
                                    value={tempDate.getMonth()} 
                                    onChange={(val) => {
                                        const d = new Date(tempDate);
                                        d.setMonth(Number(val));
                                        setTempDate(d);
                                    }}
                                />
                            </div>
                             <div className="flex-1 z-10 text-center">
                                <WheelColumn 
                                    options={years} 
                                    value={tempDate.getFullYear()} 
                                    onChange={(val) => {
                                        const d = new Date(tempDate);
                                        d.setFullYear(Number(val));
                                        setTempDate(d);
                                    }}
                                />
                            </div>
                            <div className="w-4 flex items-center justify-center font-bold text-slate-500 pb-1">:</div>
                             <div className="flex-1 z-10 text-center">
                                <WheelColumn 
                                    options={hoursArr} 
                                    value={tempDate.getHours()} 
                                    onChange={(val) => {
                                        const d = new Date(tempDate);
                                        d.setHours(Number(val));
                                        setTempDate(d);
                                    }}
                                />
                            </div>
                             <div className="flex-1 z-10 text-center">
                                <WheelColumn 
                                    options={minutesArr} 
                                    value={Math.floor(tempDate.getMinutes() / 5) * 5} 
                                    onChange={(val) => {
                                        const d = new Date(tempDate);
                                        d.setMinutes(Number(val));
                                        setTempDate(d);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex p-4 gap-3 pt-6 bg-[#1c1c1e]">
                            <button 
                                onClick={() => setIsPickerOpen(false)}
                                className="flex-1 h-12 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDate}
                                className="flex-1 h-12 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-glow transition-all"
                            >
                                Set Time
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="absolute inset-0 z-[60] flex items-end">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setShowPaymentModal(false)}
                    ></div>
                    <div className="relative w-full bg-white dark:bg-surface-dark rounded-t-3xl animate-slide-up overflow-hidden safe-area-pb shadow-2xl p-6">
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Select Payment Method</h3>
                        
                        <div className="space-y-3 mb-6">
                            {paymentMethods.map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => {
                                        setSelectedCardId(method.id);
                                        setShowPaymentModal(false);
                                    }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                        selectedCardId === method.id 
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                                        : 'border-slate-200 dark:border-slate-800 hover:border-primary/30'
                                    }`}
                                >
                                    <div className={`size-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 ${
                                        selectedCardId === method.id ? 'bg-white text-primary' : 'bg-slate-100 dark:bg-slate-800'
                                    }`}>
                                        <span className="material-symbols-outlined">{method.brandIcon}</span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className={`font-bold text-sm ${selectedCardId === method.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{method.type}</p>
                                        <p className="text-xs text-slate-500">{method.label}</p>
                                    </div>
                                    {selectedCardId === method.id && (
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        
                        <button className="w-full py-4 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center justify-center gap-2">
                             <span className="material-symbols-outlined">add</span>
                             Add New Card
                        </button>
                    </div>
                </div>
            )}
            
            {/* Success Overlay */}
             {showSuccess && (
                <div className="absolute inset-0 z-[70] bg-white dark:bg-black flex flex-col items-center justify-center animate-fade-in">
                    <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 mb-6 animate-pop">
                        <span className="material-symbols-outlined text-5xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{bookingType === 'service' ? 'Service Requested!' : 'Booking Sent!'}</h2>
                </div>
            )}
        </div>
    );
};

export default BookingScreen;
