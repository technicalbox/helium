import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  ShieldCheck,
  Search,
  Sparkles,
  Columns,
  Settings,
  Lock,
  ExternalLink,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { Tab, HeliumSettings } from '../../types/browser';
import { ShieldPopover } from '../ShieldPopover';
import { AppMenuPopover } from './AppMenuPopover';
import { BANGS_LIST, resolveBangQuery } from '../../data/bangs';

interface NavigationToolbarProps {
  currentTab: Tab;
  settings: HeliumSettings;
  canGoBack: boolean;
  canGoForward: boolean;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onToggleZen: () => void;
  onToggleSplit: () => void;
  isSplit: boolean;
  onOpenSettings: () => void;
  onUpdatePrivacy: (key: keyof HeliumSettings['privacy'], value: boolean) => void;
  onNewTab: () => void;
  onToggleSidePanel?: () => void;
  isSidePanelOpen?: boolean;
}

export const NavigationToolbar: React.FC<NavigationToolbarProps> = ({
  currentTab,
  settings,
  canGoBack,
  canGoForward,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onHome,
  onToggleZen,
  onToggleSplit,
  isSplit,
  onOpenSettings,
  onUpdatePrivacy,
  onNewTab,
  onToggleSidePanel,
  isSidePanelOpen
}) => {
  const [inputValue, setInputValue] = useState(currentTab.url);
  const [isShieldOpen, setIsShieldOpen] = useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [isBangsMenuOpen, setIsBangsMenuOpen] = useState(false);
  const [bangSuggestions, setBangSuggestions] = useState<typeof BANGS_LIST>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(currentTab.url);
  }, [currentTab.url]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.startsWith('!')) {
      const match = val.toLowerCase();
      const filtered = BANGS_LIST.filter(
        (b) => b.prefix.toLowerCase().startsWith(match) || b.name.toLowerCase().includes(match.slice(1))
      );
      setBangSuggestions(filtered);
      setIsBangsMenuOpen(true);
    } else {
      setIsBangsMenuOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = (overrideUrl?: string) => {
    const raw = (overrideUrl || inputValue).trim();
    if (!raw) return;

    // Check for native bang search
    const bangResult = resolveBangQuery(raw);
    if (bangResult.isBang && bangResult.targetUrl) {
      onNavigate(bangResult.targetUrl);
      setIsBangsMenuOpen(false);
      return;
    }

    // Check for internal helium:// URLs
    if (raw.startsWith('helium://')) {
      onNavigate(raw);
      setIsBangsMenuOpen(false);
      return;
    }

    // If matches chrome:// map to helium://
    if (raw.startsWith('chrome://')) {
      const page = raw.replace('chrome://', '');
      onNavigate(`helium://${page}`);
      setIsBangsMenuOpen(false);
      return;
    }

    // Check if domain or full URL
    if (raw.includes('.') && !raw.includes(' ') && !raw.startsWith('http')) {
      onNavigate(`https://${raw}`);
      setIsBangsMenuOpen(false);
      return;
    }

    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      onNavigate(raw);
      setIsBangsMenuOpen(false);
      return;
    }

    // Default search engine fallback
    let searchTemplate = 'https://duckduckgo.com/?q={q}';
    if (settings.search.defaultEngine === 'brave') searchTemplate = 'https://search.brave.com/search?q={q}';
    if (settings.search.defaultEngine === 'kagi') searchTemplate = 'https://kagi.com/search?q={q}';
    if (settings.search.defaultEngine === 'startpage') searchTemplate = 'https://www.startpage.com/sp/search?query={q}';
    if (settings.search.defaultEngine === 'google') searchTemplate = 'https://www.google.com/search?q={q}';

    onNavigate(searchTemplate.replace('{q}', encodeURIComponent(raw)));
    setIsBangsMenuOpen(false);
  };

  return (
    <div
      className={`bg-[#1b1f30] border-b border-[#2c2f42] flex items-center px-3 gap-2 relative select-none ${
        settings.appearance.compactUI ? 'h-9 py-1' : 'h-11 py-1.5'
      }`}
    >
      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-[#202434] disabled:opacity-35 disabled:hover:bg-transparent transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-[#202434] disabled:opacity-35 disabled:hover:bg-transparent transition-colors"
          title="Forward"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onReload}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-[#202434] transition-colors"
          title="Reload"
        >
          <RotateCw className={`w-3.5 h-3.5 ${currentTab.isLoading ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
        <button
          onClick={onHome}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-[#202434] transition-colors"
          title="Home (helium://newtab)"
        >
          <Home className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Omnibox / Address Bar Container */}
      <div
        className={`flex-1 flex items-center relative ${
          settings.appearance.centeredAddressBar ? 'max-w-2xl mx-auto' : ''
        }`}
      >
        <div className="w-full relative flex items-center bg-[#1a1d28] border border-[#2d3244] hover:border-[#3d445c] focus-within:border-indigo-500 rounded-lg h-8 px-2.5 transition-all shadow-inner">
          {/* Security & Bang indicator */}
          <div className="flex items-center gap-1.5 mr-2 text-slate-400">
            {inputValue.startsWith('https://') || inputValue.startsWith('helium://') ? (
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Search className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>

          {/* Omnibox Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => e.target.select()}
            placeholder="Search or enter URL (use !g, !w, !k for native bangs)..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none font-sans"
          />

          {/* Native Bang Quick Trigger */}
          <button
            onClick={() => {
              setInputValue('!');
              setBangSuggestions(BANGS_LIST);
              setIsBangsMenuOpen(true);
              inputRef.current?.focus();
            }}
            title="Helium Native Bangs (!g, !w, !k, !gh...)"
            className="px-1.5 py-0.5 rounded text-[11px] font-mono text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 flex items-center gap-1 transition-colors ml-1"
          >
            <span>!bangs</span>
          </button>
        </div>

        {/* Bang Autocomplete Dropdown */}
        {isBangsMenuOpen && bangSuggestions.length > 0 && (
          <div className="absolute top-9 left-0 right-0 bg-[#181b24] border border-[#2f3548] rounded-xl shadow-2xl z-50 p-2 max-h-64 overflow-y-auto">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-[#262a38] flex items-center justify-between">
              <span>Helium Native Bangs</span>
              <span className="text-indigo-400 font-normal">Parsed natively in C++</span>
            </div>
            <div className="py-1 space-y-0.5">
              {bangSuggestions.map((bang) => (
                <div
                  key={bang.prefix}
                  onClick={() => {
                    setInputValue(`${bang.prefix} `);
                    setIsBangsMenuOpen(false);
                    inputRef.current?.focus();
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-600/20 hover:text-indigo-200 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded text-[11px]">
                      {bang.prefix}
                    </span>
                    <span className="text-slate-200">{bang.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{bang.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons & Shield */}
      <div className="flex items-center gap-1 relative">
        {/* Shield Button */}
        <div className="relative">
          <button
            onClick={() => setIsShieldOpen(!isShieldOpen)}
            className={`p-1.5 rounded-lg flex items-center gap-1 text-xs transition-colors ${
              settings.privacy.uBlockEnabled
                ? 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-[#202434]'
            }`}
            title="Helium Privacy & uBlock Origin Shield"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-[11px] text-emerald-400">14</span>
          </button>

          <ShieldPopover
            isOpen={isShieldOpen}
            onClose={() => setIsShieldOpen(false)}
            settings={settings}
            onUpdatePrivacy={onUpdatePrivacy}
            currentUrl={currentTab.url}
          />
        </div>

        {/* Ask Gemini Side Panel Toggle */}
        <button
          onClick={onToggleSidePanel}
          className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            isSidePanelOpen
              ? 'text-white bg-[#3551d2] shadow-sm'
              : 'text-slate-300 hover:bg-[#202434] hover:text-white'
          }`}
          title="Toggle Ask Gemini Side Panel"
        >
          <Sparkles className={`w-4 h-4 ${isSidePanelOpen ? 'text-white' : 'text-[#8ba2ff]'}`} />
          <span className="hidden sm:inline text-xs font-medium">Gemini</span>
        </button>

        {/* Split View Toggle */}
        <button
          onClick={onToggleSplit}
          className={`p-1.5 rounded-lg transition-colors ${
            isSplit ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-[#202434]'
          }`}
          title="Split View (Side-by-Side Content)"
        >
          <Columns className="w-4 h-4" />
        </button>

        {/* Zen Mode Toggle */}
        <button
          onClick={onToggleZen}
          className={`p-1.5 rounded-lg transition-colors ${
            settings.appearance.zenMode ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-[#202434]'
          }`}
          title="Zen Mode (Hide chrome)"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-[#202434] transition-colors"
          title="Helium Settings (helium://settings)"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Helium App Menu (3-dots button with border as per patches/helium/ui/app-menu-button.patch) */}
        <div className="relative">
          <button
            onClick={() => setIsAppMenuOpen(!isAppMenuOpen)}
            className={`p-1.5 rounded-lg border border-[#2c2f42] hover:bg-[#252a3f] transition-colors ${
              isAppMenuOpen ? 'bg-[#252a3f] text-white border-indigo-500/50' : 'text-slate-300'
            }`}
            title="Customize and control Helium"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AppMenuPopover
            isOpen={isAppMenuOpen}
            onClose={() => setIsAppMenuOpen(false)}
            onNewTab={onNewTab}
            onNavigate={onNavigate}
            onToggleSidePanel={onToggleSidePanel}
          />
        </div>
      </div>
    </div>
  );
};
