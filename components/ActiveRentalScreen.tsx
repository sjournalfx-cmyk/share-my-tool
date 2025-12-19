
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ActiveRentalScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine Role: 'renter' (default) or 'owner'
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode') === 'owner' ? 'owner' : 'renter';
    const isOwner = mode === 'owner';

    // Renter States: 'pickup-info', 'scan-owner-qr', 'condition-start', 'active', 'condition-end', 'show-renter-qr', 'completed', 'purchased'
    // Owner States:  'owner-pickup-info', 'owner-inspect', 'owner-verify-id', 'owner-scan-renter', 'active', 'owner-return-inspect', 'owner-scan-return', 'owner-rate', 'owner-completed'
    
    const [viewState, setViewState] = useState(mode === 'owner' ? 'owner-pickup-info' : 'pickup-info');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [photo, setPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    
    // Management Modals State
    const [activeModal, setActiveModal] = useState<'extend' | 'issue' | 'rules' | null>(null);
    const [extendDays, setExtendDays] = useState(1);
    const [issueType, setIssueType] = useState('Not working');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Confirmation Modals State
    const [showReturnConfirm, setShowReturnConfirm] = useState(false);
    const [showBuyoutModal, setShowBuyoutModal] = useState(false);

    // Timer Logic
    useEffect(() => {
        let interval: any;
        if (viewState === 'active') {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [viewState]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleExtendSubmit = () => {
        setActiveModal(null);
        showToast(`Request sent to extend by ${extendDays} day${extendDays > 1 ? 's' : ''}`);
        // Reset after use
        setTimeout(() => setExtendDays(1), 500);
    };

    const handleIssueSubmit = () => {
        setActiveModal(null);
        showToast("Issue reported. Support will contact you shortly.");
    };

    // ================== SHARED COMPONENTS ==================

    const ScannerView = ({ onScan, label }: { onScan: () => void, label: string }) => {
        useEffect(() => {
            // Auto scan simulation
            const timer = setTimeout(() => {
               setIsScanning(true);
               setTimeout(() => {
                   setIsScanning(false);
                   onScan();
               }, 1500);
            }, 1000);
            return () => clearTimeout(timer);
        }, []);

        return (
            <div className="relative h-full flex flex-col bg-black animate-fade-in">
                <div className="absolute top-0 left-0 w-full p-4 pt-safe z-20 flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <span className="text-white font-bold text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">{label}</span>
                    <div className="size-10"></div>
                </div>
                
                {/* Camera Simulation */}
                <div 
                    onClick={onScan}
                    className="flex-1 bg-slate-800 relative cursor-pointer group overflow-hidden"
                >
                    <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`size-64 border-2 rounded-3xl relative transition-all duration-300 ${isScanning ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-white/50'}`}>
                            {/* Corner markers */}
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-lg"></div>
                            
                            {/* Scanning Line */}
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500/50 animate-[scan_2s_infinite]"></div>
                            
                            {isScanning && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">Scanning...</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="absolute bottom-20 w-full text-center p-4">
                        <p className="text-white/80 text-sm font-medium animate-pulse">Align QR code within frame</p>
                    </div>
                </div>
            </div>
        );
    };

    const ActiveRentalView = ({ isOwner }: { isOwner: boolean }) => (
        <div className="flex flex-col h-full bg-slate-900 text-white animate-fade-in relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900"></div>

            {/* Header with Collapse Button */}
            <div className="absolute top-0 left-0 w-full p-4 pt-safe z-30 flex justify-between items-center">
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
                    aria-label="Collapse to Dashboard"
                >
                    <span className="material-symbols-outlined">expand_more</span>
                </button>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold tracking-wide">ACTIVE</span>
                </div>
                <button 
                    onClick={() => navigate('/help')}
                    className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
                >
                    <span className="material-symbols-outlined">help</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 p-6 pt-20">
                
                {/* Timer Section */}
                <div className="mb-2">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Time Elapsed</span>
                </div>
                <div className="text-7xl font-black font-mono tracking-tighter mb-8 tabular-nums drop-shadow-2xl">
                    {formatTime(elapsedTime)}
                </div>

                {/* Info Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full max-w-sm mb-6">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-white bg-cover bg-center shrink-0" style={{backgroundImage: isOwner ? 'url("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop")' : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDe6Wcs7CcKOtPxjafC55ogztY2wJ8xLE0vBvtYnW-5OQXxVdVlxElKh61XV-kCRxANw6JxdCigI6Xflf49KuKwluJqIR3a6UMLsA2ri1_4aSQzxppoY8qRtd03DBcFzPtgCyTnbSLDzpaQVLLzDKosoSkOi0Pqcta8vCABc4hZhum1xqf4ax-eUDYI1Ki-j6UoxJZmxC6qRCqvBHA2ppGhE7y4wEHiMLM05h-PYtvG3xBeqZEQcnPQ9swZQukIWjg8N_5m0GcCI94I")'}}></div>
                        <div className="text-left flex-1 min-w-0">
                            <h3 className="font-bold text-base leading-tight truncate">{isOwner ? "Rented to Alex" : "DeWalt Drill"}</h3>
                            <p className="text-slate-300 text-xs truncate">{isOwner ? "Due back at 6:00 PM" : "$15.00 / day • Due 6:00 PM"}</p>
                        </div>
                         <div className="text-right">
                             <p className="text-xs text-slate-400">Deposit</p>
                             <p className="text-sm font-bold text-green-400">$100</p>
                         </div>
                    </div>
                </div>

                {/* Management Actions Grid */}
                <div className="w-full max-w-sm mb-6">
                    <p className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 pl-1">Manage Rental</p>
                    <div className="grid grid-cols-4 gap-3">
                        <button className="flex flex-col items-center gap-2 group active:scale-95 transition-transform" onClick={() => navigate('/chat')}>
                             <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-blue-400">chat</span>
                             </div>
                             <span className="text-[10px] font-medium text-slate-300">Chat</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 group active:scale-95 transition-transform" onClick={() => setActiveModal('extend')}>
                             <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-amber-400">update</span>
                             </div>
                             <span className="text-[10px] font-medium text-slate-300">Extend</span>
                        </button>
                         <button className="flex flex-col items-center gap-2 group active:scale-95 transition-transform" onClick={() => setActiveModal('issue')}>
                             <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-red-400">report_problem</span>
                             </div>
                             <span className="text-[10px] font-medium text-slate-300">Issue</span>
                        </button>
                         <button className="flex flex-col items-center gap-2 group active:scale-95 transition-transform" onClick={() => setActiveModal('rules')}>
                             <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-purple-400">article</span>
                             </div>
                             <span className="text-[10px] font-medium text-slate-300">Rules</span>
                        </button>
                    </div>
                </div>

                {/* Rent to Own (Renter Only) */}
                {!isOwner && (
                    <div 
                        onClick={() => setShowBuyoutModal(true)}
                        className="w-full max-w-sm bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500 rounded-full text-white">
                                <span className="material-symbols-outlined text-lg">shopping_bag</span>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-indigo-200">Love this tool?</p>
                                <p className="text-xs text-slate-400">Buy it now & skip the return.</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-indigo-200">arrow_forward</span>
                    </div>
                )}
            </div>

            <div className="p-4 relative z-10 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pb-8">
                <button 
                    onClick={() => setShowReturnConfirm(true)}
                    className="w-full h-14 bg-white text-slate-900 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-slate-100"
                >
                    <span className="material-symbols-outlined">keyboard_return</span>
                    <span>{isOwner ? "Process Return" : "Return Tool"}</span>
                </button>
            </div>
        </div>
    );

    // ================== RENTER COMPONENTS ==================

    const RenterPickupView = () => (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="flex-1 px-6 pt-24 flex flex-col items-center text-center">
                <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined text-4xl">location_on</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pickup Time</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Go to the location below to meet Sarah.</p>
                
                <div className="w-full bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 text-left mb-6">
                    <div className="size-12 rounded-full bg-slate-200 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQCnxcTiY5nKrKkYNtVae8ksL-Qvss7nooNMjfbB1JM2WRRrZjWNpbS7cixDmYPOSqUqORPLNIdJ7kC14bNjFIrhkBoNwBpRxo36Yhu5IIz0BGr-rMAm66_afFSyL9jwTP7-ie9g5puePG7KgMTLX9wF16_0uYkWPaO2tbZj3unr6_CyepmSQOxPbDFSRynQqNoHDOSMLa5GNcXNHMZgNWyDMjwLyJjlfNe2A6IUYwSfdDn4nBHipdRTLKZMtnPD_5GjNkhwDcD66h')"}}></div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Sarah M.</p>
                        <p className="text-xs text-slate-500">Mission District, SF</p>
                    </div>
                    <button onClick={() => navigate('/chat')} className="ml-auto size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">chat</span>
                    </button>
                </div>

                <div className="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4 relative overflow-hidden">
                     {/* Mock Map */}
                     <div className="absolute inset-0 opacity-50 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Mission+District,San+Francisco,CA&zoom=14&size=600x300&key=YOUR_API_KEY_HERE')] bg-cover bg-center"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                         <span className="material-symbols-outlined text-4xl text-red-500 drop-shadow-md">location_on</span>
                     </div>
                </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                    onClick={() => setViewState('scan-owner-qr')}
                    className="w-full h-14 bg-primary hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined">qr_code_scanner</span>
                    <span>Scan Owner's QR</span>
                </button>
            </div>
        </div>
    );

    const RenterConditionCheckView = ({ isReturn }: { isReturn: boolean }) => (
        <div className="flex flex-col h-full animate-slide-up bg-background-light dark:bg-background-dark">
            <div className="flex-1 px-6 pt-24 flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{isReturn ? "Final Check" : "Inspect Tool"}</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">{isReturn ? "Take a photo before returning to confirm condition." : "Check the tool for any existing damage."}</p>

                <div 
                    onClick={triggerFileInput}
                    className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors overflow-hidden relative"
                >
                    {photo ? (
                        <>
                            <img src={photo} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold">Retake Photo</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">add_a_photo</span>
                            <span className="text-slate-500 font-medium">Add Photo</span>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </div>
            </div>
            <div className="p-4 flex gap-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                    className="flex-1 h-14 font-bold text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl flex flex-col items-center justify-center leading-none"
                    onClick={() => setActiveModal('issue')}
                >
                    <span>Report Issue</span>
                </button>
                <button 
                    onClick={() => {
                        setPhoto(null); // Reset photo
                        if (mode === 'owner') {
                            if (viewState === 'owner-inspect') setViewState('owner-verify-id');
                        } else {
                            if (isReturn) {
                                setViewState('show-renter-qr');
                            } else {
                                setViewState('active');
                            }
                        }
                    }}
                    disabled={!photo && isReturn} // Require photo on return
                    className={`flex-[2] h-14 font-bold text-white rounded-xl shadow-lg transition-all ${!photo && isReturn ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-primary'}`}
                >
                    {isReturn ? "Confirm & Return" : "Looks Good"}
                </button>
            </div>
        </div>
    );

    const RenterShowQrView = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white animate-fade-in items-center justify-center p-6 text-center">
             <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-slide-up">
                 <h2 className="text-2xl font-bold mb-2">Show to Owner</h2>
                 <p className="text-slate-500 text-sm mb-6">Sarah needs to scan this to complete the return.</p>
                 
                 <div className="aspect-square w-full bg-slate-100 rounded-xl overflow-hidden mb-6 relative">
                     <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ReturnCompleted" 
                        alt="Return QR Code" 
                        className="w-full h-full object-contain mix-blend-multiply"
                    />
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-0.5 bg-red-500/50 animate-[scan_2s_infinite]"></div>
                     </div>
                </div>

                <button 
                    onClick={() => setViewState('completed')}
                    className="text-sm text-slate-400 hover:text-primary underline"
                >
                    Simulate Owner Scan
                </button>
             </div>
        </div>
    );

    const RenterCompletedView = () => (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in">
             <div className="flex-1 p-6 flex flex-col items-center text-center pt-24">
                <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 mb-4 shadow-float">
                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Rental Complete</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Hope the tool helped with your project!</p>

                <div className="w-full bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 space-y-3">
                         <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Total Paid</span>
                            <span className="font-bold text-slate-900 dark:text-white">$15.00</span>
                        </div>
                        <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                            <span className="text-sm">Security Deposit Released</span>
                            <span className="font-bold">+$100.00</span>
                        </div>
                    </div>
                     <div className="bg-slate-50 dark:bg-white/5 p-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 text-center">A receipt has been sent to your email.</p>
                    </div>
                </div>
            </div>
             <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark pb-8">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <span>Back to Dashboard</span>
                </button>
            </div>
        </div>
    );

    const PurchasedView = () => (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in">
             <div className="flex-1 p-6 flex flex-col items-center text-center pt-24">
                <div className="size-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 mb-4 shadow-float animate-bounce">
                    <span className="material-symbols-outlined text-5xl">celebration</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">It's Yours!</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">You successfully purchased the DeWalt Drill.</p>

                <div className="w-full bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-4">
                     <p className="text-sm text-slate-500 mb-1">Total Charged</p>
                     <p className="text-3xl font-bold text-slate-900 dark:text-white">$135.00</p>
                     <p className="text-xs text-slate-400 mt-2">Receipt #998822</p>
                </div>
            </div>
             <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark pb-8">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <span>View in Inventory</span>
                </button>
            </div>
        </div>
    );

    // ================== OWNER SPECIFIC COMPONENTS ==================

    const OwnerPickupView = () => (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="flex-1 px-6 pt-24 flex flex-col items-center text-center">
                <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <span className="material-symbols-outlined text-4xl">person_pin_circle</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ready for Handoff</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Alex is arriving at 2:00 PM. Have your DeWalt Drill ready.</p>
                
                <div className="w-full bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 text-left mb-6">
                    <div className="size-12 rounded-full bg-slate-200 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop')"}}></div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Alex Johnson</p>
                        <p className="text-xs text-slate-500">Renter • 5.0 ★</p>
                    </div>
                    <button onClick={() => navigate('/chat')} className="ml-auto size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">chat</span>
                    </button>
                </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                    onClick={() => setViewState('owner-inspect')}
                    className="w-full h-14 bg-primary hover:bg-sky-500 text-white font-bold rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined">play_circle</span>
                    <span>Start Handoff Process</span>
                </button>
            </div>
        </div>
    );

    const OwnerVerifyIdView = () => (
        <div className="flex flex-col h-full animate-slide-up">
            <div className="flex-1 px-6 pt-24 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Verify Identity</h1>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Please check that the person in front of you matches their profile photo.</p>
                
                <div className="relative size-48 rounded-full border-4 border-slate-200 dark:border-slate-700 p-1 mb-8">
                    <div className="w-full h-full rounded-full bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop')"}}></div>
                    <div className="absolute bottom-2 right-2 size-10 bg-green-500 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-background-dark">
                        <span className="material-symbols-outlined text-lg">check</span>
                    </div>
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Alex Johnson</h2>
            </div>
            <div className="p-4 flex gap-4 border-t border-slate-100 dark:border-slate-800">
                <button className="flex-1 h-14 font-bold text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl">No Match</button>
                <button 
                    onClick={() => setViewState('owner-scan-renter')}
                    className="flex-[2] h-14 font-bold text-white bg-primary rounded-xl shadow-lg"
                >
                    Confirm & Scan QR
                </button>
            </div>
        </div>
    );

    const OwnerReturnInspectView = () => (
        <div className="flex flex-col h-full animate-slide-up bg-background-light dark:bg-background-dark">
             <div className="flex-1 px-6 pt-24 flex flex-col text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check Tool Condition</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Inspect your DeWalt Drill. Is it in good working order?</p>

                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe6Wcs7CcKOtPxjafC55ogztY2wJ8xLE0vBvtYnW-5OQXxVdVlxElKh61XV-kCRxANw6JxdCigI6Xflf49KuKwluJqIR3a6UMLsA2ri1_4aSQzxppoY8qRtd03DBcFzPtgCyTnbSLDzpaQVLLzDKosoSkOi0Pqcta8vCABc4hZhum1xqf4ax-eUDYI1Ki-j6UoxJZmxC6qRCqvBHA2ppGhE7y4wEHiMLM05h-PYtvG3xBeqZEQcnPQ9swZQukIWjg8N_5m0GcCI94I" className="w-32 mx-auto mb-4 rounded-lg" />
                    <p className="text-sm font-bold">Your Reference Photo</p>
                </div>
            </div>
             <div className="p-4 flex gap-4 border-t border-slate-100 dark:border-slate-800">
                <button className="flex-1 h-14 font-bold text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl flex flex-col items-center justify-center leading-none">
                    <span>Has Damage</span>
                    <span className="text-[10px] font-normal">Report Issue</span>
                </button>
                <button 
                    onClick={() => setViewState('owner-scan-return')}
                    className="flex-[2] h-14 font-bold text-white bg-primary rounded-xl shadow-lg"
                >
                    Good Condition
                </button>
            </div>
        </div>
    );

    const OwnerRateView = () => (
        <div className="flex flex-col h-full animate-slide-up bg-background-light dark:bg-background-dark">
             <div className="flex-1 px-6 pt-24 flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Rate Alex</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">How was your experience with this renter?</p>

                <div className="flex gap-2 mb-8">
                    {[1,2,3,4,5].map(i => (
                        <span key={i} className="material-symbols-outlined text-5xl text-amber-400 cursor-pointer hover:scale-110 transition-transform">star</span>
                    ))}
                </div>

                <textarea placeholder="Write a review (optional)..." className="w-full h-32 p-4 rounded-xl bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-800 resize-none"></textarea>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                    onClick={() => setViewState('owner-completed')}
                    className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg"
                >
                    Submit & See Earnings
                </button>
            </div>
        </div>
    );

    const OwnerCompletedView = () => (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in overflow-y-auto">
            <div className="flex-1 p-6 flex flex-col items-center text-center pt-24">
                <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 mb-4 shadow-float">
                    <span className="material-symbols-outlined text-5xl">paid</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-1">$25.00</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Added to your wallet</p>

                <div className="w-full bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-white/5 p-4 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Earnings Breakdown</p>
                    </div>
                    <div className="p-6 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Rental Price</span>
                            <span className="font-bold text-slate-900 dark:text-white">$30.00</span>
                        </div>
                        <div className="flex justify-between items-center text-red-400">
                            <span className="text-sm">ToolPool Service Fee</span>
                            <span className="font-bold">-$5.00</span>
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-900 dark:text-white font-bold">Net Profit</span>
                            <span className="font-bold text-green-600 text-lg">$25.00</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark pb-8">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <span>Back to Dashboard</span>
                </button>
            </div>
        </div>
    );


    // ================== MAIN RENDER ==================

    return (
        <div className="h-full w-full bg-white dark:bg-black overflow-hidden relative">
            {/* Common Header for non-fullscreen views */}
            {viewState !== 'active' && !viewState.includes('scan') && (
                <div className="absolute top-0 left-0 w-full p-4 pt-safe z-20 flex items-center">
                     <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                </div>
            )}
            
            {/* Toast Notification */}
            {toastMessage && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] animate-fade-in w-max max-w-[90%]">
                    <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-slate-900 px-4 py-3 rounded-xl text-sm font-medium shadow-xl flex items-center gap-2">
                         <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                         {toastMessage}
                    </div>
                </div>
            )}

            {/* View Switching Logic based on Mode and State */}
            
            {/* RENTER FLOW */}
            {viewState === 'pickup-info' && <RenterPickupView />}
            {viewState === 'scan-owner-qr' && <ScannerView label="Scan Owner's QR" onScan={() => setViewState('condition-start')} />}
            {viewState === 'condition-start' && <RenterConditionCheckView isReturn={false} />}
            {viewState === 'condition-end' && <RenterConditionCheckView isReturn={true} />}
            {viewState === 'show-renter-qr' && <RenterShowQrView />}
            {viewState === 'completed' && <RenterCompletedView />}
            {viewState === 'purchased' && <PurchasedView />}
            
            {/* OWNER FLOW */}
            {viewState === 'owner-pickup-info' && <OwnerPickupView />}
            {viewState === 'owner-inspect' && <RenterConditionCheckView isReturn={false} />} {/* Reusing: Owner also takes photo */}
            {viewState === 'owner-verify-id' && <OwnerVerifyIdView />}
            {viewState === 'owner-scan-renter' && <ScannerView label="Scan Renter's QR" onScan={() => setViewState('active')} />}
            {viewState === 'owner-return-inspect' && <OwnerReturnInspectView />}
            {viewState === 'owner-scan-return' && <ScannerView label="Scan Return QR" onScan={() => setViewState('owner-rate')} />}
            {viewState === 'owner-rate' && <OwnerRateView />}
            {viewState === 'owner-completed' && <OwnerCompletedView />}

            {/* SHARED ACTIVE STATE */}
            {viewState === 'active' && <ActiveRentalView isOwner={mode === 'owner'} />}

            {/* MODALS OVERLAYS */}
            {/* Extend Modal */}
            {activeModal === 'extend' && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => {
                    if (e.target === e.currentTarget) setActiveModal(null);
                }}>
                    <div className="bg-white dark:bg-surface-dark w-full rounded-t-3xl p-6 animate-slide-up shadow-2xl safe-area-pb">
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Extend Rental</h3>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Add Days</span>
                            <div className="flex items-center gap-4">
                                 <button onClick={() => setExtendDays(Math.max(1, extendDays - 1))} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xl text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700">-</button>
                                 <span className="font-bold text-2xl w-8 text-center text-slate-900 dark:text-white">{extendDays}</span>
                                 <button onClick={() => setExtendDays(extendDays + 1)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xl text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-700">+</button>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl mb-6 flex justify-between items-center border border-slate-100 dark:border-slate-800">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Additional Cost</span>
                            <span className="font-bold text-xl text-primary">+${(extendDays * 15).toFixed(2)}</span>
                        </div>
                        <button onClick={handleExtendSubmit} className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">Confirm Extension</button>
                    </div>
                </div>
            )}

            {/* Issue Modal */}
            {activeModal === 'issue' && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => {
                    if (e.target === e.currentTarget) setActiveModal(null);
                }}>
                    <div className="bg-white dark:bg-surface-dark w-full rounded-t-3xl p-6 animate-slide-up shadow-2xl safe-area-pb">
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Report an Issue</h3>
                        <div className="space-y-3 mb-6">
                            {['Tool not working', 'Damaged', 'Missing parts', 'Other'].map(type => (
                                <button key={type} onClick={() => setIssueType(type)} className={`w-full p-4 rounded-xl border text-left flex justify-between transition-colors ${issueType === type ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                                    <span className={`font-medium ${issueType === type ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{type}</span>
                                    {issueType === type && <span className="material-symbols-outlined text-primary">check_circle</span>}
                                </button>
                            ))}
                        </div>
                        <textarea placeholder="Describe the problem..." className="w-full h-24 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-white/5 mb-4 resize-none text-slate-900 dark:text-white focus:ring-primary focus:border-primary"></textarea>
                        <button onClick={handleIssueSubmit} className="w-full h-14 bg-red-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">Report Issue</button>
                    </div>
                </div>
            )}

            {/* Rules Modal */}
            {activeModal === 'rules' && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => {
                    if (e.target === e.currentTarget) setActiveModal(null);
                }}>
                    <div className="bg-white dark:bg-surface-dark w-full rounded-t-3xl p-6 animate-slide-up shadow-2xl safe-area-pb max-h-[80vh] overflow-y-auto">
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Rental Rules</h3>
                        <div className="space-y-6 mb-8">
                            <div className="flex gap-4">
                                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                                    <span className="material-symbols-outlined">cleaning_services</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white mb-1">Clean after use</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Please wipe down the tool before returning to avoid cleaning fees.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 shrink-0">
                                    <span className="material-symbols-outlined">umbrella</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white mb-1">Keep it dry</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Do not use in rain or wet conditions. Store indoors.</p>
                                </div>
                            </div>
                             <div className="flex gap-4">
                                <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shrink-0">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white mb-1">Return on time</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Late returns incur an additional daily fee.</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setActiveModal(null)} className="w-full h-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl active:scale-95 transition-all">Got it</button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showReturnConfirm && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-slide-up">
                        <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 mx-auto">
                            <span className="material-symbols-outlined text-2xl">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">End Rental?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6 leading-relaxed">
                            Are you sure you want to return the tool now? This will stop the timer and calculate the final cost.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowReturnConfirm(false)}
                                className="flex-1 h-12 rounded-xl font-bold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    setShowReturnConfirm(false);
                                    setViewState(isOwner ? 'owner-return-inspect' : 'condition-end');
                                }}
                                className="flex-1 h-12 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors"
                            >
                                Yes, Return
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buyout Modal */}
            {showBuyoutModal && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in p-4">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-slide-up text-left">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Buy this Tool</h3>
                                <p className="text-sm text-slate-500">DeWalt 20V Max Cordless Drill</p>
                            </div>
                            <button onClick={() => setShowBuyoutModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <span className="material-symbols-outlined text-slate-400">close</span>
                            </button>
                        </div>
                        
                        <div className="space-y-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Original Price</span>
                                <span className="font-bold text-slate-900 dark:text-white">$150.00</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                <span>Rental Credit</span>
                                <span className="font-bold">-$15.00</span>
                            </div>
                            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-slate-900 dark:text-white">Pay Now</span>
                                <span className="text-primary">$135.00</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                setShowBuyoutModal(false);
                                setViewState('purchased');
                            }}
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined">payments</span>
                            <span>Complete Purchase</span>
                        </button>
                        <p className="text-center text-[10px] text-slate-400 mt-3">Ownership transfers immediately upon payment.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveRentalScreen;
