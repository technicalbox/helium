import React, { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Moon, Volume2, VolumeX, Compass, Settings, Flag, ShieldCheck, Globe, Pin, Sparkles } from 'lucide-react';
import { Tab } from '../../types/browser';
import { HeliumLogo } from '../HeliumLogo';

interface VerticalTabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onToggleMute: (id: string) => void;
  onToggleHibernate: (id: string) => void;
  onNavigateInternal: (url: string) => void;
  onToggleSidePanel?: () => void;
  isSidePanelOpen?: boolean;
}

export const VerticalTabBar: React.FC<VerticalTabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onToggleMute,
  onToggleHibernate,
  onNavigateInternal,
  onToggleSidePanel,
  isSidePanelOpen
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const getFavicon = (url: string) => {
    if (url === 'helium://newtab') return <Compass className="w-4 h-4 text-indigo-400" />;
    if (url === 'helium://settings') return <Settings className="w-4 h-4 text-slate-400" />;
    if (url === 'helium://flags') return <Flag className="w-4 h-4 text-amber-400" />;
    if (url === 'helium://privacy-test') return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    if (url === 'helium://patches') return <span className="font-mono text-xs text-cyan-400 font-bold">git</span>;
    return <Globe className="w-4 h-4 text-slate-400" />;
  };

  const pinnedTabs = tabs.filter((t) => t.isPinned);
  const regularTabs = tabs.filter((t) => !t.isPinned);

  return (
    <aside
      className={`h-full bg-[#171a2c] border-r border-[#2c2f42] flex flex-col transition-all duration-200 select-none ${
        collapsed ? 'w-14' : 'w-56'
      }`}
    >
      {/* Top Header & Collapse Button */}
      <div className="p-3 flex items-center justify-between border-b border-[#2c2f42]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <HeliumLogo size={18} />
            <span className="font-semibold text-slate-200 text-xs tracking-wide">Helium Tabs</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-[#1f2330] rounded text-slate-400 hover:text-slate-200 transition-colors mx-auto"
          title={collapsed ? 'Expand Tab Sidebar' : 'Collapse Tab Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Access Internal Applets */}
      <div className="p-2 border-b border-[#1f222e] grid grid-cols-4 gap-1">
        <button
          onClick={() => onNavigateInternal('helium://newtab')}
          title="New Tab"
          className="p-2 rounded-lg bg-[#161822] hover:bg-[#202434] text-slate-300 flex items-center justify-center transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
        </button>
        <button
          onClick={() => onNavigateInternal('helium://privacy-test')}
          title="Privacy Shield & Noise Test"
          className="p-2 rounded-lg bg-[#161822] hover:bg-[#202434] text-slate-300 flex items-center justify-center transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </button>
        <button
          onClick={() => onNavigateInternal('helium://patches')}
          title="Patch Explorer"
          className="p-2 rounded-lg bg-[#161822] hover:bg-[#202434] text-slate-300 flex items-center justify-center transition-colors font-mono text-[10px] text-cyan-400 font-bold"
        >
          diff
        </button>
        <button
          onClick={() => onNavigateInternal('helium://settings')}
          title="Helium Settings"
          className="p-2 rounded-lg bg-[#161822] hover:bg-[#202434] text-slate-300 flex items-center justify-center transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Ask Gemini Side Panel Trigger Button in Sidebar */}
      <div className="px-2 py-1.5 border-b border-[#2c2f42]">
        <button
          onClick={onToggleSidePanel}
          className={`w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl transition-all text-xs font-medium border ${
            isSidePanelOpen
              ? 'bg-[#3551d2] text-white border-[#516bec] shadow-md'
              : 'bg-[#1b1f30] hover:bg-[#222537] text-[#bac3ff] border-[#2c2f42] hover:border-[#3551d2]/50'
          }`}
          title="Ask Gemini AI Side Panel (Cmd/Ctrl + Shift + G)"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isSidePanelOpen ? 'text-white' : 'text-[#8ba2ff]'}`} />
          {!collapsed && <span>Ask Gemini</span>}
        </button>
      </div>

      {/* Tabs List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {regularTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-200 border border-indigo-500/30 font-medium'
                  : 'text-slate-400 hover:bg-[#171a25] hover:text-slate-200'
              } ${tab.isHibernated ? 'opacity-60 italic' : ''}`}
            >
              <div className="flex-shrink-0">{getFavicon(tab.url)}</div>

              {!collapsed && (
                <>
                  <span className="truncate flex-1 text-[11.5px]">{tab.title}</span>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {tab.isHibernated && <Moon className="w-3 h-3 text-amber-400" />}
                    {tab.audioPlaying && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleMute(tab.id);
                        }}
                        className="p-0.5"
                      >
                        {tab.isMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-indigo-400" />}
                      </button>
                    )}
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCloseTab(tab.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#282c3c] rounded text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom New Tab Button */}
      <div className="p-2 border-t border-[#1f222e]">
        <button
          onClick={onNewTab}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#181b26] hover:bg-[#222636] text-slate-300 text-xs font-medium transition-colors border border-[#252a3a]"
        >
          <Plus className="w-4 h-4 text-indigo-400" />
          {!collapsed && <span>New Tab</span>}
        </button>
      </div>
    </aside>
  );
};
