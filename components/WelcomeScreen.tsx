import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col bg-background-light dark:bg-background-dark h-full animate-fade-in">
      <div className="@container px-4 py-2 shrink-0 mt-8">
        <div 
          className="w-full aspect-[4/5] max-h-[420px] bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-2xl relative shadow-lg transform transition-transform duration-700 hover:scale-[1.01]" 
          style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvC9S16I1LXSKpd_avDHVPOu9Q_Fq_VK_M7yaXb2EOZDe8tpFGzj6JZM51IpKZCYQdtJ8InE9FIsloMfpLRq01TrWXffFiUaAJLXwwxnxBvdwvMkKNFRKtygCFZBU06FsYxswYCXnDYhuDWJZep9zCVTMbUlmGZCOBlc0y7ZWCVemocChJPrHVQ2r0kEuRLjrkJmXC6skfZhA__fyl6SIeVUdehbygO7N2UGjsm1uJKFPoFssUWgXlUNGrZkAuVs0q7PSN0pAuNkwA")'}}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="relative z-10 p-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 mb-2 shadow-sm">
              <span className="material-symbols-outlined text-white text-[18px]">verified_user</span>
              <span className="text-white text-xs font-medium tracking-wide">Trusted by 10k+ DIYers</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 px-6 pt-6 pb-4">
        <h1 className="text-[#111618] dark:text-white font-display tracking-tight text-[32px] font-bold leading-[1.15] text-center mb-3">
          Welcome to <span className="text-primary">ToolPool</span>
        </h1>
        <p className="text-[#637588] dark:text-[#9ba8b6] font-display text-base font-normal leading-relaxed text-center mb-8 px-2">
          Rent the equipment you need for your next DIY project, or list your own tools to earn extra cash. Safe, local, and easy.
        </p>
        <div className="mt-auto space-y-3 w-full pb-6">
          <button onClick={() => navigate('/map')} className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all text-white text-[17px] font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20">
            <span className="truncate">Sign Up with Email</span>
          </button>
          <button onClick={() => navigate('/map')} className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-[#f0f3f4] dark:bg-[#2a343b] hover:bg-[#e5e8e9] dark:hover:bg-[#343f47] active:scale-[0.98] transition-all text-[#111618] dark:text-white gap-3 text-[17px] font-bold leading-normal tracking-[0.015em]">
            <span className="text-[#111618] dark:text-white material-symbols-outlined text-[24px]">ios</span>
            <span className="truncate">Continue with Apple</span>
          </button>
          <div className="text-center pt-4">
            <p className="text-[#637588] dark:text-[#9ba8b6] text-sm">
              Already have an account? <Link to="/map" className="text-primary font-semibold hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;