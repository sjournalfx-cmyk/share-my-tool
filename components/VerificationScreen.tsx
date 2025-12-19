import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationScreen: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [idScanned, setIdScanned] = useState(false);
    const [selfieTaken, setSelfieTaken] = useState(false);

    const handleNext = () => {
        if (step === 1 && !idScanned) return;
        if (step === 2 && !selfieTaken) return;
        
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Finish flow
            navigate('/map');
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="animate-fade-in">
                        <div className="mb-6">
                            <h1 className="text-slate-900 dark:text-white text-[28px] font-bold leading-tight tracking-tight mb-3">Verify Your Identity</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed">We need to verify your ID to ensure the safety of all tool owners and renters. This process takes about 2 minutes.</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4">Select ID Type</h3>
                            <div className="space-y-3">
                                <label className="relative flex items-center p-4 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 cursor-pointer transition-all shadow-sm group active:scale-[0.98]">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary mr-4">
                                        <span className="material-symbols-outlined">badge</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-base font-bold text-slate-900 dark:text-white">Driver's License</span>
                                        <span className="block text-xs text-slate-500 dark:text-slate-400">Recommended</span>
                                    </div>
                                    <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-sm font-bold">check</span>
                                    </div>
                                    <input defaultChecked className="absolute opacity-0 w-full h-full cursor-pointer" name="id_type" type="radio"/>
                                </label>
                                <label className="relative flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark cursor-pointer hover:border-primary/50 transition-all shadow-sm active:scale-[0.98]">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mr-4">
                                        <span className="material-symbols-outlined">flight_class</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-base font-medium text-slate-900 dark:text-white">Passport</span>
                                    </div>
                                    <div className="size-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                                    <input className="absolute opacity-0 w-full h-full cursor-pointer" name="id_type" type="radio"/>
                                </label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4">Scan Document</h3>
                            <div 
                                onClick={() => setIdScanned(true)}
                                className={`relative w-full aspect-[16/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden group cursor-pointer transition-all active:scale-[0.99] ${idScanned ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 hover:border-primary hover:bg-primary/5'}`}
                            >
                                {idScanned ? (
                                    <div className="flex flex-col items-center animate-fade-in">
                                         <div className="size-14 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-3">
                                            <span className="material-symbols-outlined text-3xl">check</span>
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-bold">Scan Complete</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Tap to retake</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                                            <img className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA5Yg8zkw1Zude_I3h8MUkFIDxcjZ5-p_QXcPPweFeh8Ee1Hy59XksdbKQEX72j8gpmt-ktExuqCAKTW8SXVRCC3ZqmjsrvbI28BJMP9R6tm3dhqTNG7jCWVZChYeDa9oQQ8aCG9lL6bfpgQh7WrO3btLLX89i3QwjGnRzhxnraHboS_ETp-A4DO5qOx0HKvg4Ww-jam8_EeVhwMhVOviElPZzIzTQJiZIho-1OrAoe-D-c9XZ1GDsmC0VGsiTbOkPs_U5ulHYefkY"/>
                                        </div>
                                        <div className="relative z-10 flex flex-col items-center p-6 text-center">
                                            <div className="size-14 rounded-full bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
                                            </div>
                                            <p className="text-slate-900 dark:text-white font-semibold">Tap to scan front of ID</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Make sure lighting is good</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fade-in flex flex-col items-center h-full">
                        <div className="mb-8 text-center">
                            <h1 className="text-slate-900 dark:text-white text-[28px] font-bold leading-tight tracking-tight mb-3">Face Verification</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed">Center your face in the frame and follow the instructions.</p>
                        </div>

                        <div className="relative w-64 h-80 rounded-[45%] border-4 border-slate-200 dark:border-slate-700 overflow-hidden mb-8 bg-slate-100 dark:bg-slate-800 shadow-inner">
                            {selfieTaken ? (
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKmAJLeBqlWbdvOAMzcMQxxYZ2HChZlQRix_PVoaSN5xzMtJlgjCcgYsas3hsUkcvMCTFhbkvf8agzGWl8a6rIhctBoKF8OFkfnY-TAhJsBC_LvpizDF8xH8pmYDzsbONNph9Jt7gIYLQqeD_C3OkS8Fcstz5HxV2CjBoaQMizrK-ZF6CQmhDU_6cm2glDqLFXWLLLfPbOA1WB4O8Ln6xYOSd35fGAMQ_OWzccJ_T8bl1jt0wdeHy2C3jwJoVIe1re341fxMa1-UYR" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                                    <span className="material-symbols-outlined text-6xl">face</span>
                                </div>
                            )}
                            <div className="absolute inset-0 border-[6px] border-white/20 dark:border-black/20 rounded-[45%] pointer-events-none"></div>
                        </div>

                        <button 
                            onClick={() => setSelfieTaken(true)}
                            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95 ${selfieTaken ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600' : 'bg-primary text-white hover:bg-sky-500'}`}
                        >
                            <span className="material-symbols-outlined">{selfieTaken ? 'refresh' : 'photo_camera'}</span>
                            <span>{selfieTaken ? 'Retake Photo' : 'Take Selfie'}</span>
                        </button>
                    </div>
                );
            case 3:
                 return (
                    <div className="animate-slide-up flex flex-col items-center justify-center h-[60vh] text-center px-4">
                        <div className="relative mb-8">
                            <div className="size-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 shadow-lg shadow-green-500/20">
                                <span className="material-symbols-outlined text-6xl">verified_user</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-background-dark p-1 rounded-full">
                                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-lg">
                                    <span className="material-symbols-outlined">check</span>
                                </div>
                            </div>
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-3xl font-bold mb-4">You're Verified!</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xs mx-auto">
                            Thank you for verifying your identity. Your booking request has been securely sent to the owner.
                        </p>
                        
                        <div className="w-full mt-8 p-4 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                             <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">Check your email</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">We've sent you a confirmation.</p>
                            </div>
                        </div>
                    </div>
                 );
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased transition-colors duration-200 h-full flex flex-col overflow-y-auto no-scrollbar animate-fade-in">
            <div className="flex items-center px-4 py-4 justify-between sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <button onClick={handleBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-slate-900 dark:text-white" style={{fontSize: '24px'}}>{step === 1 ? 'arrow_back' : 'chevron_left'}</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Verification</h2>
            </div>

            {step < 3 && (
                <div className="flex flex-col w-full items-center justify-center gap-2 pt-2 pb-6">
                    <div className="flex gap-3">
                        <div className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'w-8 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}></div>
                        <div className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'w-8 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}></div>
                        <div className={`h-2 rounded-full transition-all duration-300 ${step >= 3 ? 'w-8 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Step {step} of 3</span>
                </div>
            )}

            <div className="flex-1 flex flex-col px-6 pb-32">
                {renderStepContent()}
            </div>

            <div className="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-4 z-50">
                {step < 3 ? (
                     <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-sm">lock</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Your data is encrypted and secure.</p>
                        </div>
                        <button 
                            onClick={handleNext} 
                            disabled={(step === 1 && !idScanned) || (step === 2 && !selfieTaken)}
                            className={`w-full font-bold py-4 rounded-xl text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                                (step === 1 && !idScanned) || (step === 2 && !selfieTaken) 
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none' 
                                : 'bg-primary hover:bg-sky-500 active:bg-sky-600 text-white shadow-primary/30'
                            }`}
                        >
                            <span>{step === 2 ? 'Finish Verification' : 'Continue'}</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/map')} 
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl text-lg shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span>Done</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerificationScreen;