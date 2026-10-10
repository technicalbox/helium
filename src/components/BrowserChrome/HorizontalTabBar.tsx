import React, { useState } from 'react';
import { Plus, X, Volume2, VolumeX, Moon, Pin, Globe, Compass, Settings, ShieldCheck, Flag, Copy } from 'lucide-react';
import { Tab } from '../../types/browser';

interface HorizontalTabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onToggleMute: (id: string) => void;
  onToggleHibernate: (id: string) => void;
  onCloseTabsToLeft: (id: string) => void;
}

export const HorizontalTabBar: React.FC<HorizontalTabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onToggleMute,
  onToggleHibernate,
  onCloseTabsToLeft
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tabId });
  };

  const getFavicon = (url: string) => {
    if (url === 'helium://newtab') return <Compass className="w-3.5 h-3.5 text-indigo-400" />;
    if (url === 'helium://settings') return <Settings className="w-3.5 h-3.5 text-slate-400" />;
    if (url === 'helium://flags') return <Flag className="w-3.5 h-3.5 text-amber-400" />;
    if (url === 'helium://privacy-test') return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
    if (url === 'helium://patches') return <span className="font-mono text-[10px] text-cyan-400 font-bold">git</span>;
    if (url === 'helium://downloads') return <span className="font-mono text-[10px] text-emerald-400 font-bold">pkg</span>;
    return <Globe className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="h-9 bg-[#171a2c] flex items-end px-2 gap-1 overflow-x-auto select-none pt-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
            className={`group relative flex items-center gap-2 h-8 px-3 rounded-t-xl text-xs transition-all max-w-[210px] min-w-[120px] cursor-pointer ${
              isActive
                ? 'bg-[#1b1f30] text-[#fefbff] font-medium border-t border-x border-[#2c2f42] z-10'
                : 'bg-transparent text-[#8d8fa6] hover:bg-[#1f2338]/60 hover:text-slate-200'
            } ${tab.isHibernated ? 'opacity-65 italic' : ''}`}
          >
            {/* Favicon */}
            <div className="flex-shrink-0">
              {getFavicon(tab.url)}
            </div>

            {/* Title */}
            <span className="truncate flex-1 font-medium text-[11.5px]">
              {tab.title}
            </span>

            {/* Status Indicators */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {tab.isHibernated && (
                <span title="Hibernated to save memory" className="text-amber-400">
                  <Moon className="w-2.5 h-2.5" />
                </span>
              )}
              {tab.audioPlaying && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute(tab.id);
                  }}
                  title={tab.isMuted ? 'Unmute tab' : 'Mute tab'}
                  className="p-0.5 hover:text-white"
                >
                  {tab.isMuted ? (
                    <VolumeX className="w-3 h-3 text-rose-400" />
                  ) : (
                    <Volume2 className="w-3 h-3 text-indigo-400 animate-pulse" />
                  )}
                </button>
              )}

              {/* Close Tab Button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className={`p-0.5 hover:bg-[#2c2f42] hover:text-white rounded-full transition-opacity ${
                    isActive ? 'opacity-70 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* New Tab Button */}
      <button
        onClick={onNewTab}
        title="Open New Tab (⌘T)"
        className="p-1.5 mb-1 rounded-full text-[#8d8fa6] hover:text-white hover:bg-[#222537] transition-colors flex-shrink-0"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Helium Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-[#1b1f30] border border-[#2c2f42] rounded-xl shadow-2xl py-1 text-xs text-slate-200 min-w-[170px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onToggleHibernate(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#3551d2]/20 hover:text-indigo-200 flex items-center gap-2"
          >
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>Hibernate Tab</span>
          </button>
          <button
            onClick={() => {
              onToggleMute(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#3551d2]/20 hover:text-indigo-200 flex items-center gap-2"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mute / Unmute Audio</span>
          </button>
          <button
            onClick={() => {
              onCloseTabsToLeft(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#3551d2]/20 hover:text-indigo-200 flex items-center gap-2"
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span>Close Tabs to Left</span>
          </button>
          <button
            onClick={() => {
              const target = tabs.find((t) => t.id === contextMenu.tabId);
              if (target) navigator.clipboard.writeText(target.url);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#3551d2]/20 hover:text-indigo-200 flex items-center gap-2 border-t border-[#2c2f42]"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Tab URL</span>
          </button>
        </div>
      )}

      {/* Global dismiss click for context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
