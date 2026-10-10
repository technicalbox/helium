import React from 'react';
import { Minus, Square, X, PanelLeft, PanelTop, Maximize2, Sparkles, LayoutGrid } from 'lucide-react';
import { HeliumLogo } from '../HeliumLogo';
import { HeliumSettings } from '../../types/browser';

interface TitleBarProps {
  settings: HeliumSettings;
  onUpdateAppearance: (key: keyof HeliumSettings['appearance'], value: any) => void;
  activeTabTitle: string;
  tabCount: number;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  settings,
  onUpdateAppearance,
  activeTabTitle,
  tabCount
}) => {
  return (
    <header className="h-9 bg-[#171a2c] border-b border-[#2c2f42] flex items-center justify-between px-3 select-none text-xs text-slate-400">
      {/* Window Controls */}
      <div className="flex items-center gap-2">
        {settings.appearance.windowFrameStyle === 'macos' ? (
          <div className="flex items-center gap-2 mr-3">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer inline-block" />
          </div>
        ) : null}

        {/* Brand & Version Badge */}
        <div className="flex items-center gap-1.5 text-slate-200 font-medium">
          <HeliumLogo size={16} />
          <span className="text-slate-100 font-semibold tracking-tight">Helium</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            v0.19.2
          </span>
        </div>
      </div>

      {/* Center Title or Tab Info */}
      <div className="flex items-center gap-2 max-w-sm truncate text-slate-300 text-xs">
        <span className="truncate">{activeTabTitle}</span>
        <span className="text-[10px] text-slate-500">({tabCount} tabs)</span>
      </div>

      {/* Quick Layout & Window Mode Switchers */}
      <div className="flex items-center gap-1.5">
        {/* Vertical Tabs Toggle */}
        <button
          onClick={() => onUpdateAppearance('verticalTabs', !settings.appearance.verticalTabs)}
          title={settings.appearance.verticalTabs ? 'Switch to Horizontal Tabs' : 'Switch to Vertical Tabs (Arc-style)'}
          className={`p-1.5 rounded hover:bg-[#1f2330] transition-colors ${
            settings.appearance.verticalTabs ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'
          }`}
        >
          <PanelLeft className="w-3.5 h-3.5" />
        </button>

        {/* Zen Mode Toggle */}
        <button
          onClick={() => onUpdateAppearance('zenMode', !settings.appearance.zenMode)}
          title="Toggle Zen Mode (Cmd/Ctrl + Shift + A)"
          className={`p-1.5 rounded hover:bg-[#1f2330] transition-colors ${
            settings.appearance.zenMode ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        {/* Compact UI Toggle */}
        <button
          onClick={() => onUpdateAppearance('compactUI', !settings.appearance.compactUI)}
          title="Toggle Compact UI"
          className={`p-1.5 rounded hover:bg-[#1f2330] transition-colors ${
            settings.appearance.compactUI ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'
          }`}
        >
          <PanelTop className="w-3.5 h-3.5" />
        </button>

        {settings.appearance.windowFrameStyle !== 'macos' && (
          <div className="flex items-center ml-2 border-l border-[#202330] pl-2 gap-1 text-slate-400">
            <button className="p-1 hover:bg-[#202330] rounded"><Minus className="w-3 h-3" /></button>
            <button className="p-1 hover:bg-[#202330] rounded"><Square className="w-2.5 h-2.5" /></button>
            <button className="p-1 hover:bg-rose-900/40 hover:text-rose-300 rounded"><X className="w-3 h-3" /></button>
          </div>
        )}
      </div>
    </header>
  );
};
