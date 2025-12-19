
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const QrCodeScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    
    // Generate dynamic QR data based on user profile
    const qrData = `ToolPoolUser-${user.name.replace(/\s+/g, '')}-ID8821`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    return (
        <div className="bg-slate-900 font-display text-white h-full flex flex-col animate-fade-in relative">
            <div className="absolute top-0 left-0 w-full p-4 pt-safe z-20 flex justify-between items-center">
                 <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>
                <span className="font-bold text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">Identity Pass</span>
                <div className="size-10"></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                
                <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-slide-up">
                    <div className="flex flex-col items-center mb-6">
                        <div className="size-20 rounded-full bg-slate-200 bg-cover bg-center border-4 border-white shadow-lg mb-3" style={{backgroundImage: `url('${user.avatar}')`}}></div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span className="text-xs font-bold uppercase tracking-wide">Verified Member</span>
                        </div>
                    </div>

                    <div className="aspect-square w-full bg-white rounded-xl overflow-hidden mb-6 relative">
                         {/* Loading placeholder could go here, but image usually loads fast enough */}
                         <img 
                            src={qrUrl}
                            alt="User Identity QR Code" 
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <p className="text-slate-500 text-sm">
                        Show this code to the owner or renter to verify your identity at meetup.
                    </p>
                </div>
            </div>

            <div className="p-8 pb-12 text-center text-slate-400 text-sm">
                <span className="material-symbols-outlined text-2xl mb-2 block">security</span>
                <p>This code changes dynamically for security.</p>
            </div>
        </div>
    );
};

export default QrCodeScreen;