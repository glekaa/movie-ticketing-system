import { useState } from 'react';

const Header = () => {
    const [activeTab, setActiveTab] = useState('Now Playing');
    const tabs = ['Now Playing', 'Coming Soon', 'Cinemas', 'Offers'];
    return (
        <header className="w-full bg-[#111111] px-4 md:px-8 h-18 flex items-center justify-between">
            <div className="flex-shrink-0 w-32">
                <span className="text-3xl font-bold text-gray-300 tracking-tighter">Absolute</span>
            </div>
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-[#222222] rounded-full p-1.5 border border-white/5 shadow-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab
                                ? 'text-white border border-white/20 bg-white/5'
                                : 'text-gray-400 hover:text-white border border-transparent'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
            <div className="flex items-center gap-6 flex-shrink-0 text-gray-400">
                <button className="hover:text-white transition-colors duration-300" aria-label="Location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </button>
                <button className="hover:text-white transition-colors duration-300" aria-label="Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1"></circle>
                        <circle cx="19" cy="21" r="1"></circle>
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                    </svg>
                </button>
                <button className="hover:text-white transition-colors duration-300" aria-label="Profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="10" r="3"></circle>
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                    </svg>
                </button>
                <button className="hover:text-white transition-colors duration-300 ml-1" aria-label="Menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" x2="20" y1="12" y2="12"></line>
                        <line x1="4" x2="20" y1="6" y2="6"></line>
                        <line x1="4" x2="20" y1="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
