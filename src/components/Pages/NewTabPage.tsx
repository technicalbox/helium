import React, { useState } from 'react';
import { Search, ShieldCheck, Sparkles, Zap, Flag, Download, GitBranch, ArrowRight, ExternalLink } from 'lucide-react';
import { HeliumLogo } from '../HeliumLogo';
import { BANGS_LIST } from '../../data/bangs';

interface NewTabPageProps {
  onNavigate: (url: string) => void;
}

interface TileItem {
  title: string;
  url: string;
  monogram: string;
  color: string;
  domain: string;
}

export const NewTabPage: React.FC<NewTabPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Most Visited tiles matching patches/helium/ui/restyle-ntp-tiles.patch
  // (size: 46px, border-radius: 8px, tile border-radius: 10px)
  const tiles: TileItem[] = [
    { title: 'DuckDuckGo', url: 'https://duckduckgo.com', monogram: 'DDG', color: 'bg-[#de5833]', domain: 'duckduckgo.com' },
    { title: 'GitHub', url: 'https://github.com', monogram: 'GH', color: 'bg-[#24292f]', domain: 'github.com' },
    { title: 'Wikipedia', url: 'https://wikipedia.org', monogram: 'W', color: 'bg-[#54595d]', domain: 'wikipedia.org' },
    { title: 'Kagi', url: 'https://kagi.com', monogram: 'K', color: 'bg-[#ffc83b]', domain: 'kagi.com' },
    { title: 'Reddit', url: 'https://reddit.com', monogram: 'RD', color: 'bg-[#ff4500]', domain: 'reddit.com' },
    { title: 'Hacker News', url: 'https://news.ycombinator.com', monogram: 'HN', color: 'bg-[#ff6600]', domain: 'news.ycombinator.com' },
    { title: 'ArchWiki', url: 'https://wiki.archlinux.org', monogram: 'AW', color: 'bg-[#1793d1]', domain: 'wiki.archlinux.org' },
    { title: 'MDN Docs', url: 'https://developer.mozilla.org', monogram: 'MDN', color: 'bg-[#000000]', domain: 'developer.mozilla.org' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigate(searchQuery);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 bg-[#171a2c] text-slate-100 select-none">
      {/* Official Centered Helium Logo Mark (patches/helium/ui/helium-logo-icons.patch) */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="mb-4 transform hover:scale-105 transition-transform duration-200">
          <HeliumLogo size={80} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#fefbff] font-sans">
          Helium
        </h1>
        <p className="text-[#8d8fa6] text-xs mt-1.5 font-medium">
          The browser made for people, with love.
        </p>
      </div>

      {/* Main Omnibox Search (Realbox from clean-new-tab-page.patch) */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mb-9">
        <div className="relative flex items-center bg-[#1b1f30] border border-[#2c2f42] hover:border-[#3551d2] focus-within:border-[#3551d2] rounded-full shadow-lg px-4 py-3 transition-all">
          <Search className="w-4 h-4 text-[#8d8fa6] mr-3 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the web or type a URL (supports !g, !w, !k bangs)..."
            className="w-full bg-transparent text-sm text-[#fefbff] placeholder-[#8d8fa6] outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="p-1.5 rounded-full bg-[#3551d2] hover:bg-[#516bec] text-white transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Native Bang quick hints */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-[#8d8fa6]">
          <span>Native bangs:</span>
          {['!w privacy', '!k search', '!g chromium', '!gh helium'].map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => onNavigate(hint)}
              className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-[#1b1f30] hover:bg-[#222537] text-indigo-300 transition-colors border border-[#2c2f42]"
            >
              {hint}
            </button>
          ))}
        </div>
      </form>

      {/* Restyled Most-Visited Tiles matching patches/helium/ui/restyle-ntp-tiles.patch */}
      {/* 46px square icon with 8px rounded corners, 10px tile border radius */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-2xl w-full mb-10">
        {tiles.map((tile) => (
          <button
            key={tile.title}
            onClick={() => onNavigate(tile.url)}
            className="group flex flex-col items-center gap-2 p-2 rounded-[10px] hover:bg-[#1b1f30] border border-transparent hover:border-[#2c2f42] transition-all"
          >
            {/* 46px square icon with 8px radius */}
            <div
              className={`w-[46px] h-[46px] rounded-[8px] ${tile.color} flex items-center justify-center font-bold text-white shadow-md text-xs font-mono group-hover:scale-105 transition-transform`}
            >
              {tile.monogram}
            </div>
            <span className="text-[11px] text-[#8d8fa6] group-hover:text-[#fefbff] truncate w-14 text-center">
              {tile.title}
            </span>
          </button>
        ))}
      </div>

      {/* Helium Architecture Shortcuts Card */}
      <div className="w-full max-w-2xl bg-[#1b1f30]/80 border border-[#2c2f42] rounded-2xl p-4 backdrop-blur shadow-xl">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2c2f42]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-[#fefbff]">Helium Shields Active</span>
          </div>
          <span className="text-[11px] text-[#8d8fa6] font-mono">0 Telemetry Pings • uBlock Origin Embedded</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <button
            onClick={() => onNavigate('helium://privacy-test')}
            className="p-2.5 rounded-xl bg-[#171a2c] hover:bg-[#222537] border border-[#2c2f42] flex flex-col items-start gap-1 text-left transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-medium text-[#fefbff]">Privacy Test</span>
            <span className="text-[10px] text-[#8d8fa6]">Canvas & Audio noise</span>
          </button>

          <button
            onClick={() => onNavigate('helium://flags')}
            className="p-2.5 rounded-xl bg-[#171a2c] hover:bg-[#222537] border border-[#2c2f42] flex flex-col items-start gap-1 text-left transition-colors"
          >
            <Flag className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-[#fefbff]">Helium Flags</span>
            <span className="text-[10px] text-[#8d8fa6]">GN & runtime flags</span>
          </button>

          <button
            onClick={() => onNavigate('helium://patches')}
            className="p-2.5 rounded-xl bg-[#171a2c] hover:bg-[#222537] border border-[#2c2f42] flex flex-col items-start gap-1 text-left transition-colors"
          >
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-[#fefbff]">Patch Explorer</span>
            <span className="text-[10px] text-[#8d8fa6]">370+ C++ patches</span>
          </button>

          <button
            onClick={() => onNavigate('helium://downloads')}
            className="p-2.5 rounded-xl bg-[#171a2c] hover:bg-[#222537] border border-[#2c2f42] flex flex-col items-start gap-1 text-left transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="font-medium text-[#fefbff]">Downloads</span>
            <span className="text-[10px] text-[#8d8fa6]">macOS, Linux, Win</span>
          </button>
        </div>
      </div>
    </div>
  );
};
