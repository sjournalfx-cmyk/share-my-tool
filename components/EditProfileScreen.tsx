
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const EditProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useUser();
    
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [bio, setBio] = useState(user.bio);
    const [avatar, setAvatar] = useState(user.avatar);
    
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API delay
        setTimeout(() => {
            updateUser({
                name,
                email,
                phone,
                bio,
                avatar
            });
            setIsSaving(false);
            navigate(-1);
        }, 800);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Edit Profile</h2>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="ml-auto text-primary font-bold text-sm hover:text-sky-600 disabled:opacity-50 flex items-center gap-1"
                >
                    {isSaving && <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-8">
                <div className="flex flex-col items-center mb-8">
                    <div 
                        className="relative group cursor-pointer"
                        onClick={triggerFileInput}
                    >
                        <div className="size-28 rounded-full bg-slate-200 bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-md transition-opacity group-hover:opacity-90" style={{backgroundImage: `url('${avatar}')`}}></div>
                        <div className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-lg hover:bg-sky-500 transition-colors border-4 border-white dark:border-background-dark">
                            <span className="material-symbols-outlined text-lg block">edit</span>
                        </div>
                    </div>
                    <button onClick={triggerFileInput} className="mt-3 text-sm font-medium text-primary cursor-pointer hover:underline">
                        Change Profile Photo
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handlePhotoChange} 
                    />
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">person</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">mail</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                        <div className="relative">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">call</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full h-32 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white resize-none transition-all"
                            placeholder="Tell others about yourself..."
                        />
                        <p className="text-right text-xs text-slate-400 mt-1">{bio.length}/150</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileScreen;