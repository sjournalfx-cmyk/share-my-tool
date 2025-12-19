import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationsScreen: React.FC = () => {
    const navigate = useNavigate();

    const notifications = [
        {
            id: 1,
            title: "Rental Approved",
            message: "Sarah M. accepted your request for DeWalt 20V Drill.",
            time: "2 mins ago",
            type: "success",
            read: false,
        },
        {
            id: 2,
            title: "Reminder: Pickup Today",
            message: "Don't forget to pick up your rental at 2:00 PM.",
            time: "1 hour ago",
            type: "info",
            read: false,
        },
        {
            id: 3,
            title: "Payment Successful",
            message: "You have been charged $15.00 for your recent rental.",
            time: "Yesterday",
            type: "payment",
            read: true,
        },
        {
            id: 4,
            title: "New Feature Alert",
            message: "You can now use AI to identify tools from photos!",
            time: "3 days ago",
            type: "system",
            read: true,
        }
    ];

    const getIcon = (type: string) => {
        switch(type) {
            case 'success': return 'check_circle';
            case 'info': return 'schedule';
            case 'payment': return 'receipt';
            case 'system': return 'auto_awesome';
            default: return 'notifications';
        }
    };

    const getColor = (type: string) => {
        switch(type) {
            case 'success': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
            case 'info': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
            case 'payment': return 'text-slate-500 bg-slate-100 dark:bg-slate-800';
            case 'system': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in">
             <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Notifications</h2>
                <button className="ml-auto text-primary text-sm font-bold">Mark all read</button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {notifications.map(item => (
                    <div 
                        key={item.id}
                        className={`p-4 border-b border-slate-100 dark:border-slate-800 flex gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${!item.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    >
                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${getColor(item.type)}`}>
                            <span className="material-symbols-outlined text-xl">{getIcon(item.type)}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm ${!item.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>{item.title}</h4>
                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{item.time}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.message}</p>
                        </div>
                         {!item.read && <div className="self-center size-2 rounded-full bg-primary shrink-0"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsScreen;