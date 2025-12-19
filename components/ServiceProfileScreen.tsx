
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ServiceProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useUser();
    
    const [profession, setProfession] = useState(user.profession || "");
    const [skills, setSkills] = useState<string[]>(user.skills || []);
    const [newSkill, setNewSkill] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateUser({
                profession,
                skills
            });
            setIsSaving(false);
            navigate(-1);
        }, 600);
    };

    const addSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Skills & Profession</h2>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="ml-auto text-primary font-bold text-sm hover:text-sky-600 disabled:opacity-50 flex items-center gap-1"
                >
                    {isSaving && <div className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-8">
                <div className="mb-6">
                    <div className="size-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4">
                        <span className="material-symbols-outlined text-3xl">engineering</span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Service Details</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Add your skills and profession to let renters know what kind of services you can offer alongside your tool rentals.
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Primary Profession</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                placeholder="e.g. Carpenter, Electrician, DIY Expert"
                                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">badge</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Skills & Expertise</label>
                        <form onSubmit={addSkill} className="relative mb-3">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill (e.g. Drywall Repair)"
                                className="w-full h-12 pl-10 pr-12 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400">handyman</span>
                            <button 
                                type="submit"
                                disabled={!newSkill.trim()}
                                className="absolute right-2 top-2 size-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark disabled:opacity-50 disabled:bg-slate-300"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                        </form>

                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800 text-sm font-medium animate-pop">
                                    <span>{skill}</span>
                                    <button 
                                        onClick={() => removeSkill(skill)}
                                        className="size-4 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[10px]">close</span>
                                    </button>
                                </div>
                            ))}
                            {skills.length === 0 && (
                                <div className="text-sm text-slate-400 italic p-2 w-full text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                                    No skills added yet.
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 flex gap-3 items-start">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">lightbulb</span>
                        <div className="text-sm text-amber-900 dark:text-amber-100">
                            <p className="font-bold mb-1">Pro Tip</p>
                            <p className="opacity-80">Adding skills increases your chances of getting hired for service tasks alongside your tool rentals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceProfileScreen;
