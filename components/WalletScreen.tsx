
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface Transaction {
    id: number;
    title: string;
    subtitle: string;
    amount: number;
    type: 'credit' | 'debit' | 'neutral';
    status: 'completed' | 'escrow' | 'released' | 'pending';
    date: string;
    icon: string;
    method?: string;
    ref?: string;
}

interface CreditItem {
    id: number;
    tool: string;
    totalPaid: number;
    buyoutPrice: number;
    progress: number;
    image: string;
}

const WalletScreen: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'transactions' | 'credits'>('transactions');
    
    // Modals & Selection State
    const [activeModal, setActiveModal] = useState<'withdraw' | 'topup' | 'transaction' | 'escrow' | 'buyout' | null>(null);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [selectedCredit, setSelectedCredit] = useState<CreditItem | null>(null);
    
    // Form & Process State
    const [amountInput, setAmountInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Data State
    const [balances, setBalances] = useState({
        available: 185.50,
        pending: 225.00, // Escrow
        credits: 45.00   // Rent-to-Own
    });

    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            id: 1,
            title: "Rental Earnings",
            subtitle: "Bosch Hammer Drill",
            amount: 25.00,
            type: "credit",
            status: "completed",
            date: "Today, 10:30 AM",
            icon: "input",
            method: "Rental Income",
            ref: "#88219A"
        },
        {
            id: 2,
            title: "Security Deposit Hold",
            subtitle: "Pending Return Scan",
            amount: 200.00,
            type: "neutral",
            status: "escrow",
            date: "Today, 9:00 AM",
            icon: "lock",
            method: "Visa ...4242",
            ref: "#HOLD-992"
        },
        {
            id: 3,
            title: "Rental Payment",
            subtitle: "Extension Ladder 24ft",
            amount: -45.00,
            type: "debit",
            status: "completed",
            date: "Sep 20",
            icon: "output",
            method: "Wallet Balance",
            ref: "#RENT-771"
        },
        {
            id: 4,
            title: "Deposit Released",
            subtitle: "Makita Circular Saw",
            amount: 0.00,
            type: "neutral",
            status: "released",
            date: "Aug 12",
            icon: "lock_open",
            method: "Original Payment Method",
            ref: "#REL-221"
        }
    ]);

    const [credits, setCredits] = useState<CreditItem[]>([
        {
            id: 1,
            tool: "Extension Ladder 24ft",
            totalPaid: 45.00,
            buyoutPrice: 120.00,
            progress: 37,
            image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070&auto=format&fit=crop"
        }
    ]);

    // --- Actions ---

    const handleTopUp = () => {
        if (!amountInput) return;
        setIsProcessing(true);
        setTimeout(() => {
            const amount = parseFloat(amountInput);
            setBalances(prev => ({ ...prev, available: prev.available + amount }));
            const newTx: Transaction = {
                id: Date.now(),
                title: "Wallet Top Up",
                subtitle: "Added funds",
                amount: amount,
                type: "credit",
                status: "completed",
                date: "Just now",
                icon: "add_card",
                method: "Visa ...4242",
                ref: `#TOP-${Math.floor(Math.random() * 1000)}`
            };
            setTransactions(prev => [newTx, ...prev]);
            setIsProcessing(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setActiveModal(null);
                setAmountInput('');
            }, 1500);
        }, 1500);
    };

    const handleWithdraw = () => {
        if (!amountInput) return;
        const amount = parseFloat(amountInput);
        if (amount > balances.available) return;

        setIsProcessing(true);
        setTimeout(() => {
            setBalances(prev => ({ ...prev, available: prev.available - amount }));
            const newTx: Transaction = {
                id: Date.now(),
                title: "Withdrawal",
                subtitle: "Transfer to Bank",
                amount: -amount,
                type: "debit",
                status: "completed",
                date: "Just now",
                icon: "account_balance",
                method: "Chase Bank (...8829)",
                ref: `#WDR-${Math.floor(Math.random() * 1000)}`
            };
            setTransactions(prev => [newTx, ...prev]);
            setIsProcessing(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setActiveModal(null);
                setAmountInput('');
            }, 1500);
        }, 1500);
    };

    const handleBuyout = () => {
        if (!selectedCredit) return;
        const remaining = selectedCredit.buyoutPrice - selectedCredit.totalPaid;
        
        if (balances.available < remaining) {
            alert("Insufficient funds. Please top up first.");
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            setBalances(prev => ({ ...prev, available: prev.available - remaining }));
            setCredits(prev => prev.filter(c => c.id !== selectedCredit.id));
            
            const newTx: Transaction = {
                id: Date.now(),
                title: "Tool Purchase",
                subtitle: selectedCredit.tool,
                amount: -remaining,
                type: "debit",
                status: "completed",
                date: "Just now",
                icon: "shopping_bag",
                method: "Wallet Balance",
                ref: `#BUY-${Math.floor(Math.random() * 1000)}`
            };
            setTransactions(prev => [newTx, ...prev]);
            
            setIsProcessing(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setActiveModal(null);
                setSelectedCredit(null);
            }, 1500);
        }, 1500);
    };

    const openTransactionDetail = (tx: Transaction) => {
        setSelectedTx(tx);
        setActiveModal('transaction');
    };

    const openBuyoutModal = (item: CreditItem) => {
        setSelectedCredit(item);
        setActiveModal('buyout');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in relative">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate('/profile')} className="mr-4 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-bold">Wallet & Earnings</h2>
                <button className="ml-auto text-primary">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                {/* Main Card */}
                <div className="p-4">
                    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                        {/* Abstract blobs */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

                        <div className="relative z-10">
                            <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
                            <h1 className="text-4xl font-black mb-6 animate-fade-in">${balances.available.toFixed(2)}</h1>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setActiveModal('withdraw')}
                                    className="flex-1 bg-white text-slate-900 h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span> Withdraw
                                </button>
                                <button 
                                    onClick={() => setActiveModal('topup')}
                                    className="flex-1 bg-white/10 text-white h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 active:scale-95 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span> Top Up
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Secondary Status Cards */}
                    <div className="mt-3 flex gap-2">
                        <div 
                            onClick={() => setActiveModal('escrow')}
                            className="flex-1 bg-white dark:bg-surface-dark p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 active:scale-[0.98] transition-all"
                        >
                             <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">lock_clock</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Escrow</p>
                                <p className="font-bold text-slate-900 dark:text-white">${balances.pending.toFixed(2)}</p>
                            </div>
                        </div>
                         <div 
                            onClick={() => setActiveTab('credits')}
                            className="flex-1 bg-white dark:bg-surface-dark p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 active:scale-[0.98] transition-all"
                        >
                             <div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">shopping_bag</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Purchase Credits</p>
                                <p className="font-bold text-slate-900 dark:text-white">${balances.credits.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 mb-4">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button 
                            onClick={() => setActiveTab('transactions')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'transactions' ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                        >
                            Transactions
                        </button>
                        <button 
                            onClick={() => setActiveTab('credits')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'credits' ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                        >
                            Rent-to-Own
                        </button>
                    </div>
                </div>

                {/* List Content */}
                <div className="px-4 space-y-3">
                    {activeTab === 'transactions' ? (
                        transactions.length > 0 ? (
                            transactions.map(tx => (
                                <div 
                                    key={tx.id} 
                                    onClick={() => openTransactionDetail(tx)}
                                    className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-all animate-slide-up"
                                >
                                    <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${
                                        tx.status === 'escrow' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                                        tx.type === 'credit' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                                        tx.type === 'debit' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800' :
                                        'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                    }`}>
                                        <span className="material-symbols-outlined">{tx.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{tx.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{tx.subtitle}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{tx.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${
                                            tx.type === 'credit' ? 'text-green-600' :
                                            tx.type === 'debit' ? 'text-slate-900 dark:text-white' :
                                            'text-slate-400'
                                        }`}>
                                            {tx.type === 'credit' ? '+' : ''}{tx.amount !== 0 ? `$${Math.abs(tx.amount).toFixed(2)}` : '$0.00'}
                                        </p>
                                        {tx.status === 'escrow' && (
                                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md dark:bg-amber-900/40 dark:text-amber-400">HELD</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2">receipt_long</span>
                                <p className="text-sm">No transactions yet.</p>
                            </div>
                        )
                    ) : (
                        credits.length > 0 ? (
                            credits.map(item => (
                                <div key={item.id} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 animate-slide-up">
                                    <div className="flex gap-4 mb-4">
                                        <div className="size-16 rounded-xl bg-slate-200 bg-cover bg-center" style={{backgroundImage: `url('${item.image}')`}}></div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{item.tool}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Buyout Price: ${item.buyoutPrice}</p>
                                            <button 
                                                onClick={() => openBuyoutModal(item)}
                                                className="mt-2 text-primary text-xs font-bold hover:underline"
                                            >
                                                View Options
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-primary rounded-full" style={{width: `${item.progress}%`}}></div>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="font-bold text-primary">${item.totalPaid} accumulated</span>
                                        <span className="text-slate-400">${item.buyoutPrice - item.totalPaid} to go</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2">shopping_bag</span>
                                <p className="text-sm">No active rent-to-own items.</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Withdraw Modal */}
            {activeModal === 'withdraw' && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => {
                    if (e.target === e.currentTarget && !isProcessing && !showSuccess) { setActiveModal(null); setAmountInput(''); }
                }}>
                    <div className="bg-white dark:bg-surface-dark w-full rounded-t-3xl p-6 animate-slide-up shadow-2xl pb-10">
                        {showSuccess ? (
                            <div className="flex flex-col items-center py-6 animate-pop">
                                <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-4">
                                    <span className="material-symbols-outlined text-4xl">check</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Withdrawal Initiated</h3>
                                <p className="text-slate-500 text-sm text-center">Funds should arrive in 1-2 business days.</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Withdraw Funds</h3>
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-slate-500">account_balance</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Chase Bank (...8829)</p>
                                            <p className="text-xs text-slate-500">Instant Transfer</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-primary font-bold">Change</span>
                                </div>
                                <div className="relative mb-6">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold">$</span>
                                    <input 
                                        type="number" 
                                        value={amountInput}
                                        onChange={(e) => setAmountInput(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full h-16 pl-10 pr-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-3xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                    <button 
                                        onClick={() => setAmountInput(balances.available.toString())}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md"
                                    >
                                        MAX
                                    </button>
                                </div>
                                <button 
                                    onClick={handleWithdraw}
                                    disabled={isProcessing || !amountInput || parseFloat(amountInput) > balances.available || parseFloat(amountInput) <= 0}
                                    className={`w-full h-14 font-bold text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${isProcessing || !amountInput || parseFloat(amountInput) > balances.available || parseFloat(amountInput) <= 0 ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-primary hover:bg-sky-500 active:scale-95'}`}
                                >
                                    {isProcessing ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Confirm Withdrawal</span>}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Top Up Modal */}
            {activeModal === 'topup' && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => {
                    if (e.target === e.currentTarget && !isProcessing && !showSuccess) { setActiveModal(null); setAmountInput(''); }
                }}>
                    <div className="bg-white dark:bg-surface-dark w-full rounded-t-3xl p-6 animate-slide-up shadow-2xl pb-10">
                         {showSuccess ? (
                            <div className="flex flex-col items-center py-6 animate-pop">
                                <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-4">
                                    <span className="material-symbols-outlined text-4xl">add_card</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Funds Added</h3>
                                <p className="text-slate-500 text-sm">Your wallet has been updated.</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Add Funds</h3>
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-slate-500">credit_card</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Visa (...4242)</p>
                                            <p className="text-xs text-slate-500">Credit Card</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-primary font-bold">Change</span>
                                </div>
                                <div className="relative mb-6">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold">$</span>
                                    <input 
                                        type="number" 
                                        value={amountInput}
                                        onChange={(e) => setAmountInput(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full h-16 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-3xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <button 
                                    onClick={handleTopUp}
                                    disabled={isProcessing || !amountInput || parseFloat(amountInput) <= 0}
                                    className={`w-full h-14 font-bold text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${isProcessing || !amountInput || parseFloat(amountInput) <= 0 ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-primary hover:bg-sky-500 active:scale-95'}`}
                                >
                                    {isProcessing ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Add Funds</span>}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Transaction Detail Modal */}
            {activeModal === 'transaction' && selectedTx && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => {
                    if (e.target === e.currentTarget) { setActiveModal(null); setSelectedTx(null); }
                }}>
                    <div className="bg-white dark:bg-surface-dark w-full rounded-t-3xl p-6 animate-slide-up shadow-2xl pb-10">
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                        <div className="text-center mb-6">
                            <div className={`size-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
                                selectedTx.type === 'credit' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                                selectedTx.type === 'debit' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800' :
                                'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                            }`}>
                                <span className="material-symbols-outlined text-4xl">{selectedTx.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTx.type === 'credit' ? '+' : ''}${Math.abs(selectedTx.amount).toFixed(2)}</h3>
                            <p className="text-slate-500">{selectedTx.title}</p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                selectedTx.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                selectedTx.status === 'escrow' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600'
                            }`}>{selectedTx.status}</span>
                        </div>

                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Date</span>
                                <span className="font-medium text-slate-900 dark:text-white">{selectedTx.date}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">Method</span>
                                <span className="font-medium text-slate-900 dark:text-white">{selectedTx.method}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">Reference</span>
                                <span className="font-medium text-slate-900 dark:text-white font-mono">{selectedTx.ref}</span>
                            </div>
                        </div>
                        <button onClick={() => setActiveModal(null)} className="w-full mt-6 h-12 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Escrow Modal */}
            {activeModal === 'escrow' && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => {
                    if (e.target === e.currentTarget) setActiveModal(null);
                }}>
                    <div className="bg-white dark:bg-surface-dark w-full rounded-t-3xl p-6 animate-slide-up shadow-2xl pb-10">
                        <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Funds in Escrow</h3>
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl mb-6 text-sm text-blue-800 dark:text-blue-200">
                            These funds are temporarily held for security deposits. They will be released back to your available balance after successful rental returns.
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">Bosch Hammer Drill</p>
                                    <p className="text-xs text-slate-500">Security Deposit</p>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">$200.00</span>
                            </div>
                             <div className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">Makita Sander</p>
                                    <p className="text-xs text-slate-500">Security Deposit</p>
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">$25.00</span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                             <span className="font-bold text-slate-500">Total Held</span>
                             <span className="font-bold text-xl text-slate-900 dark:text-white">${balances.pending.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Buyout Modal */}
            {activeModal === 'buyout' && selectedCredit && (
                <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => {
                     if (e.target === e.currentTarget && !isProcessing && !showSuccess) { setActiveModal(null); setSelectedCredit(null); }
                }}>
                    <div className="bg-white dark:bg-surface-dark w-full rounded-t-3xl p-6 animate-slide-up shadow-2xl pb-10">
                         {showSuccess ? (
                            <div className="flex flex-col items-center py-6 animate-pop">
                                <div className="size-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-500 mb-4">
                                    <span className="material-symbols-outlined text-4xl">celebration</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Congratulations!</h3>
                                <p className="text-slate-500 text-sm">You now own the {selectedCredit.tool}.</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6"></div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Complete Buyout</h3>
                                <p className="text-sm text-slate-500 mb-6">Pay the remaining balance to own this tool.</p>

                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-500">Total Buyout Price</span>
                                        <span className="font-medium dark:text-white">${selectedCredit.buyoutPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-4">
                                        <span className="text-slate-500">Credits Applied</span>
                                        <span className="font-medium text-green-600">-${selectedCredit.totalPaid.toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-slate-200 dark:bg-slate-700 mb-4"></div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-slate-900 dark:text-white">Pay Now</span>
                                        <span className="text-primary">${(selectedCredit.buyoutPrice - selectedCredit.totalPaid).toFixed(2)}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleBuyout}
                                    disabled={isProcessing || balances.available < (selectedCredit.buyoutPrice - selectedCredit.totalPaid)}
                                    className={`w-full h-14 font-bold text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                                        isProcessing || balances.available < (selectedCredit.buyoutPrice - selectedCredit.totalPaid) 
                                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
                                    }`}
                                >
                                    {isProcessing ? (
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <span>Confirm Purchase</span>
                                    )}
                                </button>
                                {balances.available < (selectedCredit.buyoutPrice - selectedCredit.totalPaid) && (
                                    <p className="text-center text-xs text-red-500 mt-3">Insufficient funds. Please top up your wallet.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletScreen;
