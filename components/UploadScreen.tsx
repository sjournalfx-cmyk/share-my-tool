import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";

const UploadScreen: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const secondaryFileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState(1);
    const TOTAL_STEPS = 5;
    
    // AI Instance
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiSuccess, setAiSuccess] = useState(false);
    const [isPricing, setIsPricing] = useState(false);
    
    // Form State
    const [mainPhoto, setMainPhoto] = useState<string | null>(null);
    const [secondaryPhotos, setSecondaryPhotos] = useState<string[]>([]);
    
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('Good');
    const [usageNotes, setUsageNotes] = useState(''); 
    const [showConditionSheet, setShowConditionSheet] = useState(false); 
    
    // Service State
    const [offersService, setOffersService] = useState(false);
    
    const [zipCode, setZipCode] = useState('94110'); // Default SF
    const [instantBook, setInstantBook] = useState(true);
    const [rules, setRules] = useState(''); 
    
    const [dailyPrice, setDailyPrice] = useState('');
    const [hourlyPrice, setHourlyPrice] = useState(''); // Rental Hourly
    const [serviceRate, setServiceRate] = useState(''); // Operator Hourly
    const [estimatedUsage, setEstimatedUsage] = useState(5); 

    const [isPublishing, setIsPublishing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Helpers
    const handleMainPhotoClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // 1. Read for display
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Result = reader.result as string;
                setMainPhoto(base64Result);
                setAiSuccess(false); // Reset AI state when photo changes
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSecondaryPhotoAdd = () => {
        secondaryFileInputRef.current?.click();
    };

    const handleSecondaryFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Result = reader.result as string;
                setSecondaryPhotos(prev => [...prev, base64Result]);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = async () => {
        if (!mainPhoto) return;
        setIsAnalyzing(true);
        setAiSuccess(false);

        try {
            // Strip mime type prefix for API
            const base64Data = mainPhoto.split(',')[1];
            const mimeType = mainPhoto.split(';')[0].split(':')[1];

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType: mimeType, data: base64Data } },
                        { text: `Analyze this image for a tool rental marketplace. 
                          If the tool is complex (like a tractor, saw, or heavy machinery), suggest if 'offersService' might be appropriate.
                          Return a JSON object with:
                          - title: A short, clear title.
                          - brand: The brand name.
                          - category: One of ["Power Tools", "Gardening", "Cleaning", "Hand Tools", "Automotive", "Electronics"].
                          - condition: One of ["New", "Like New", "Good", "Fair", "Heavily Used"].
                          - description: A 2-sentence sales pitch.
                          - suggestService: boolean (true if this tool often requires an operator).` 
                        }
                    ]
                },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            brand: { type: Type.STRING },
                            category: { type: Type.STRING },
                            condition: { type: Type.STRING },
                            description: { type: Type.STRING },
                            suggestService: { type: Type.BOOLEAN },
                        }
                    }
                }
            });

            const data = JSON.parse(response.text || '{}');
            if (data.title) setTitle(data.title);
            if (data.brand) setBrand(data.brand);
            if (data.category) setCategory(data.category);
            if (data.condition) setCondition(data.condition);
            if (data.description) setDescription(data.description);
            if (data.suggestService) setOffersService(true);
            
            setAiSuccess(true);
            setTimeout(() => setAiSuccess(false), 4000);

        } catch (error) {
            console.error("AI Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const suggestPrice = async () => {
        setIsPricing(true);
        try {
            const prompt = `Suggest prices for a ${condition} condition ${brand} ${title}.
            Return JSON: {"dailyPrice": number, "serviceRate": number}. 
            Service rate is hourly labor cost for an operator.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            dailyPrice: { type: Type.NUMBER },
                            serviceRate: { type: Type.NUMBER }
                        }
                    }
                }
            });

            const data = JSON.parse(response.text || '{}');
            if (data.dailyPrice) setDailyPrice(data.dailyPrice.toString());
            if (data.serviceRate && offersService) setServiceRate(data.serviceRate.toString());
            
        } catch (error) {
            console.error("Pricing failed", error);
        } finally {
            setIsPricing(false);
        }
    };

    const handleNext = () => {
        if (step === 1 && !mainPhoto) return;
        if (step === 2 && (!title || !category || !description)) return;
        if (step === 3 && !zipCode) return;
        if (step === 4 && !dailyPrice) return;
        
        if (step < TOTAL_STEPS) {
            setStep(step + 1);
        } else {
            publishListing();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate('/dashboard');
    };

    const publishListing = () => {
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            setShowSuccess(true);
        }, 2000);
    };

    // Data
    const categories = [
        { name: "Power Tools", icon: "drill" },
        { name: "Gardening", icon: "potted_plant" },
        { name: "Cleaning", icon: "cleaning_services" },
        { name: "Hand Tools", icon: "handyman" },
        { name: "Automotive", icon: "car_repair" },
        { name: "Electronics", icon: "electrical_services" }
    ];

    const conditions = ["New", "Like New", "Good", "Fair", "Heavily Used"];

    // --- Render Steps ---

    const renderStep1_Photos = () => (
        <div className="animate-fade-in space-y-6">
             <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Photos</h1>
                <p className="text-slate-500 dark:text-slate-400">Renters want to see what they're getting. Add at least one clear photo.</p>
            </div>

            {/* Main Photo */}
            <div 
                onClick={handleMainPhotoClick}
                className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group transition-all ${mainPhoto ? 'border-primary' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
                {mainPhoto ? (
                    <>
                        <img src={mainPhoto} alt="Main" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined">edit</span> Change
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                        <span className="material-symbols-outlined text-5xl">add_a_photo</span>
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Tap to upload cover photo</span>
                    </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Manual AI Trigger */}
            {mainPhoto && (
                <button 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        aiSuccess 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md active:scale-[0.98] hover:shadow-lg'
                    }`}
                >
                    {isAnalyzing ? (
                        <>
                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Identifying Tool...</span>
                        </>
                    ) : aiSuccess ? (
                        <>
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            <span>Details Auto-Filled!</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                            <span>Auto-Fill Details with AI</span>
                        </>
                    )}
                </button>
            )}

            {/* Secondary Photos Grid */}
            {mainPhoto && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">More Views</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {secondaryPhotos.map((img, idx) => (
                            <div key={idx} className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative group">
                                <img src={img} className="w-full h-full object-cover" alt={`View ${idx}`} />
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSecondaryPhotos(secondaryPhotos.filter((_, i) => i !== idx));
                                    }}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                                >
                                    <span className="material-symbols-outlined text-xs">close</span>
                                </button>
                            </div>
                        ))}
                        <button 
                            onClick={handleSecondaryPhotoAdd}
                            className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                        </button>
                        <input type="file" ref={secondaryFileInputRef} className="hidden" accept="image/*" onChange={handleSecondaryFileChange} />
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep2_Details = () => (
        <div className="animate-slide-up space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tool Details</h1>
                    {title && (
                        <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Filled
                        </span>
                    )}
                </div>
                <p className="text-slate-500 dark:text-slate-400">Review the details we detected from your photo.</p>
            </div>
            
            <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Item Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Makita 18V Cordless Driver"
                        className="w-full h-12 px-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-slate-900 dark:text-white"
                    />
                </div>

                {/* Categories */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setCategory(cat.name)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-[0.98] ${category === cat.name ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}
                            >
                                <span className="material-symbols-outlined mb-1">{cat.icon}</span>
                                <span className="text-[10px] font-bold text-center leading-tight">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Brand & Condition */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Brand (Opt)</label>
                        <input 
                            type="text" 
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="e.g. DeWalt"
                            className="w-full h-12 px-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium dark:text-white"
                        />
                    </div>
                    
                    {/* Interactive Condition Selector Trigger */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Condition</label>
                        <button 
                            onClick={() => setShowConditionSheet(true)}
                            className="w-full h-12 px-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary outline-none flex items-center justify-between text-sm font-medium text-slate-900 dark:text-white group active:scale-[0.98] transition-all"
                        >
                            <span>{condition}</span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">expand_more</span>
                        </button>
                    </div>
                </div>

                {/* Service Offering Toggle */}
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-purple-600 text-lg">engineering</span>
                            Offer Operator Service?
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">I can operate this tool for the renter.</p>
                    </div>
                    <button 
                        onClick={() => setOffersService(!offersService)}
                        className={`w-12 h-7 rounded-full transition-colors relative ${offersService ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                        <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${offersService ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Includes 2 batteries, charger, and carrying case..."
                        className="w-full h-32 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-slate-900 dark:text-white resize-none"
                    ></textarea>
                </div>
            </div>
        </div>
    );

    const renderStep3_Location = () => (
        <div className="animate-slide-up space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Location & Rules</h1>
                <p className="text-slate-500 dark:text-slate-400">Where can renters pick up this item?</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Zip Code</label>
                    <div className="flex gap-3">
                         <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">location_on</span>
                            <input 
                                type="text" 
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-slate-900 dark:text-white"
                                placeholder="94110"
                            />
                         </div>
                    </div>
                </div>

                {/* Instant Book Toggle */}
                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Instant Book</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Allow renters to book without approval.</p>
                    </div>
                    <button 
                        onClick={() => setInstantBook(!instantBook)}
                        className={`w-12 h-7 rounded-full transition-colors relative ${instantBook ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                        <div className={`absolute top-1 left-1 size-5 bg-white rounded-full shadow-sm transition-transform ${instantBook ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                {/* Rules */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Rental Rules</label>
                    <textarea 
                        value={rules}
                        onChange={(e) => setRules(e.target.value)}
                        placeholder="e.g. Please clean before returning. No heavy rain usage."
                        className="w-full h-24 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-slate-900 dark:text-white resize-none"
                    ></textarea>
                </div>
            </div>
        </div>
    );

    const renderStep4_Pricing = () => (
        <div className="animate-slide-up space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pricing</h1>
                <p className="text-slate-500 dark:text-slate-400">Set your rates. We'll add a small service fee for the renter.</p>
            </div>

            <div className="space-y-4">
                 {/* AI Suggest Button */}
                 <button 
                    onClick={suggestPrice}
                    disabled={isPricing}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                 >
                    {isPricing ? (
                        <>
                             <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             <span>Analyzing Market...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">payments</span>
                            <span>Suggest Competitive Price</span>
                        </>
                    )}
                 </button>

                {/* Daily Rate */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Rental Rate</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input 
                            type="number" 
                            value={dailyPrice}
                            onChange={(e) => setDailyPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full h-14 pl-8 pr-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-2xl font-bold text-slate-900 dark:text-white"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">/ day</span>
                    </div>
                </div>

                {/* Service Rate (Conditional) */}
                {offersService && (
                    <div className="space-y-1.5 animate-fade-in">
                        <label className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Operator Hourly Rate</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-bold">$</span>
                            <input 
                                type="number" 
                                value={serviceRate}
                                onChange={(e) => setServiceRate(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-14 pl-8 pr-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-2xl font-bold text-slate-900 dark:text-white"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 text-sm">/ hr</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderStep5_Review = () => (
        <div className="animate-slide-up space-y-6">
            <div className="space-y-2 text-center">
                 <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl">inventory_2</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to Publish?</h1>
                <p className="text-slate-500 dark:text-slate-400">Your listing is ready to go live.</p>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                <div className="flex gap-4 mb-4">
                    <div className="size-20 rounded-xl bg-slate-100 bg-cover bg-center" style={{backgroundImage: `url('${mainPhoto}')`}}></div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white truncate">{title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{category}</p>
                        <p className="text-primary font-bold mt-1">${dailyPrice} <span className="text-xs font-normal text-slate-400">/ day</span></p>
                    </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                        <span>Condition</span>
                        <span className="font-medium">{condition}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Location</span>
                        <span className="font-medium">SF, {zipCode}</span>
                    </div>
                    {offersService && (
                         <div className="flex justify-between text-purple-600 font-medium">
                            <span>Service</span>
                            <span>${serviceRate}/hr</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in relative overflow-hidden">
             {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={handleBack} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex-1">
                    <h2 className="text-lg font-bold">List Item</h2>
                    <div className="flex gap-1 h-1 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                        {[...Array(TOTAL_STEPS)].map((_, i) => (
                            <div key={i} className={`h-full flex-1 transition-colors duration-300 ${i < step ? 'bg-primary' : 'bg-transparent'}`}></div>
                        ))}
                    </div>
                </div>
                <div className="text-xs font-bold text-slate-400">
                    {step}/{TOTAL_STEPS}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
                {step === 1 && renderStep1_Photos()}
                {step === 2 && renderStep2_Details()}
                {step === 3 && renderStep3_Location()}
                {step === 4 && renderStep4_Pricing()}
                {step === 5 && renderStep5_Review()}
            </div>

            {/* Bottom Actions */}
             <div className="absolute bottom-0 left-0 w-full bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-4 pb-8 safe-area-pb z-40">
                <button 
                    onClick={handleNext}
                    disabled={
                        (step === 1 && !mainPhoto) ||
                        (step === 2 && (!title || !category)) ||
                        (step === 3 && !zipCode) ||
                        (step === 4 && !dailyPrice)
                    }
                    className={`w-full h-14 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${
                        ((step === 1 && !mainPhoto) || (step === 2 && (!title || !category)) || (step === 3 && !zipCode) || (step === 4 && !dailyPrice))
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                        : 'bg-primary hover:bg-sky-500 text-white shadow-primary/30'
                    }`}
                >
                    {isPublishing ? (
                         <>
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Publishing...</span>
                        </>
                    ) : (
                        <span>{step === TOTAL_STEPS ? 'Publish Listing' : 'Continue'}</span>
                    )}
                </button>
            </div>
            
            {/* Condition Sheet Modal */}
            {showConditionSheet && (
                <div className="absolute inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowConditionSheet(false)}>
                    <div className="bg-white dark:bg-surface-dark w-full rounded-t-3xl p-6 animate-slide-up pb-10">
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Select Condition</h3>
                        <div className="space-y-2">
                            {conditions.map(c => (
                                <button 
                                    key={c} 
                                    onClick={() => {
                                        setCondition(c);
                                        setShowConditionSheet(false);
                                    }}
                                    className={`w-full p-4 rounded-xl text-left font-bold transition-colors ${condition === c ? 'bg-primary/10 text-primary' : 'bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

             {/* Success Overlay */}
             {showSuccess && (
                <div className="absolute inset-0 z-[60] bg-white dark:bg-background-dark flex flex-col items-center justify-center animate-fade-in">
                    <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 mb-6 animate-pop">
                        <span className="material-symbols-outlined text-5xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Listing Published!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">Your tool is now available for rent.</p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl active:scale-95 transition-transform"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadScreen;