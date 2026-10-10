import React from 'react';
import {
  Plus,
  Compass,
  Lock,
  Bookmark,
  Download,
  History,
  Settings,
  Flag,
  ShieldCheck,
  GitBranch,
  HelpCircle,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { HeliumLogo } from '../HeliumLogo';

interface AppMenuPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNewTab: () => void;
  onNavigate: (url: string) => void;
  onToggleSidePanel?: () => void;
}

export const AppMenuPopover: React.FC<AppMenuPopoverProps> = ({
  isOpen,
  onClose,
  onNewTab,
  onNavigate,
  onToggleSidePanel
}) => {
  if (!isOpen) return null;

  const handleAction = (url?: string, actionFn?: () => void) => {
    onClose();
    if (actionFn) actionFn();
    else if (url) onNavigate(url);
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-2 top-11 w-64 bg-[#1b1f30] border border-[#2c2f42] rounded-xl shadow-2xl z-50 py-1.5 text-xs text-slate-200 select-none animate-in fade-in zoom-in-95 duration-100">
        {/* Profile / Status Header */}
        <div className="px-3 py-2 border-b border-[#2c2f42] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeliumLogo size={16} />
            <span className="font-semibold text-slate-100 text-xs">Helium Browser</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Protected
          </span>
        </div>

        {/* Tab & Window Controls */}
        <div className="py-1">
          <button
            onClick={() => handleAction(undefined, onNewTab)}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-slate-200 text-left"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>New Tab</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">⌘T</span>
          </button>

          <button
            onClick={() => handleAction('helium://newtab')}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-slate-200 text-left"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>New Window</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">⌘N</span>
          </button>

          <button
            onClick={() => handleAction('helium://newtab')}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-slate-200 text-left"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>New Incognito Window</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">⌘⇧N</span>
          </button>
        </div>

        {/* Zoom */}
        <div className="px-3 py-1.5 border-t border-b border-[#2c2f42] flex items-center justify-between text-xs">
          <span className="text-slate-400">Zoom</span>
          <div className="flex items-center gap-2 bg-[#171a2c] px-2 py-0.5 rounded-lg border border-[#2c2f42]">
            <button className="text-slate-400 hover:text-white px-1 font-bold">-</button>
            <span className="font-mono text-[11px] text-slate-200">100%</span>
            <button className="text-slate-400 hover:text-white px-1 font-bold">+</button>
          </div>
        </div>

        {/* Features */}
        <div className="py-1">
          {onToggleSidePanel && (
            <button
              onClick={() => handleAction(undefined, onToggleSidePanel)}
              className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-[#bac3ff] text-left font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8ba2ff]" />
                <span className="text-[#fefbff]">Ask Gemini (Side Panel)</span>
              </div>
              <span className="text-[10px] text-[#8ba2ff] font-mono">⌘⇧G</span>
            </button>
          )}

          <button
            onClick={() => handleAction('helium://patches')}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-slate-200 text-left"
          >
            <div className="flex items-center gap-2.5">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>Patchset Explorer</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">370+ diffs</span>
          </button>

          <button
            onClick={() => handleAction('helium://privacy-test')}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-slate-200 text-left"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy & Noise Test</span>
            </div>
          </button>

          <button
            onClick={() => handleAction('helium://flags')}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-slate-200 text-left"
          >
            <div className="flex items-center gap-2.5">
              <Flag className="w-3.5 h-3.5 text-amber-400" />
              <span>Helium Flags</span>
            </div>
          </button>

          <button
            onClick={() => handleAction('helium://downloads')}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-slate-200 text-left"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Downloads & Releases</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">⌘J</span>
          </button>
        </div>

        {/* Settings & Help */}
        <div className="pt-1 border-t border-[#2c2f42]">
          <button
            onClick={() => handleAction('helium://settings')}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-slate-200 text-left"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">⌘,</span>
          </button>

          <button
            onClick={() => handleAction('helium://settings')}
            className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#252a3f] text-slate-200 text-left"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>About Helium</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};
