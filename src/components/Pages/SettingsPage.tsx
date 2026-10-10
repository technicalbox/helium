import React, { useState } from 'react';
import {
  Palette,
  Shield,
  Search,
  Zap,
  Lock,
  Globe,
  Sliders,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { HeliumSettings } from '../../types/browser';
import { LANGUAGES } from '../../data/languages';
import { BANGS_LIST } from '../../data/bangs';

interface SettingsPageProps {
  settings: HeliumSettings;
  onUpdateAppearance: (key: keyof HeliumSettings['appearance'], value: any) => void;
  onUpdatePrivacy: (key: keyof HeliumSettings['privacy'], value: any) => void;
  onUpdateSearch: (key: keyof HeliumSettings['search'], value: any) => void;
  onUpdatePerformance: (key: keyof HeliumSettings['performance'], value: any) => void;
  onUpdateSync: (key: keyof HeliumSettings['sync'], value: any) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateAppearance,
  onUpdatePrivacy,
  onUpdateSearch,
  onUpdatePerformance,
  onUpdateSync
}) => {
  const [activeCategory, setActiveCategory] = useState<'appearance' | 'privacy' | 'search' | 'performance' | 'sync' | 'i18n' | 'about'>('appearance');
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

  return (
    <div className="h-full flex bg-[#0e1017] text-slate-100 select-none overflow-hidden">
      {/* Settings Navigation Sidebar */}
      <aside className="w-64 bg-[#12141c] border-r border-[#202330] p-4 flex flex-col justify-between">
        <div>
          <div className="px-3 py-2 mb-4">
            <h2 className="text-base font-semibold text-white tracking-tight">Helium Settings</h2>
            <p className="text-xs text-slate-400">Customized Chromium configuration</p>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'appearance', label: 'Appearance & UI', icon: Palette },
              { id: 'privacy', label: 'Helium Noise & Privacy', icon: Shield },
              { id: 'search', label: 'Search & Native Bangs', icon: Search },
              { id: 'performance', label: 'Performance & RAM', icon: Zap },
              { id: 'sync', label: 'Encrypted Vault Sync', icon: Lock },
              { id: 'i18n', label: 'Languages (i18n)', icon: Globe },
              { id: 'about', label: 'About Helium', icon: Info }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-[#181b26] hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 rounded-xl bg-[#171a25] border border-[#242938] text-[11px] text-slate-400">
          <p className="font-medium text-slate-300 mb-1">De-googled Core</p>
          <p>Zero telemetry pings, no Google host detection, unbiased privacy.</p>
        </div>
      </aside>

      {/* Main Settings Content Area */}
      <main className="flex-1 overflow-y-auto p-8 max-w-4xl">
        {activeCategory === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Appearance</h3>
              <p className="text-xs text-slate-400">Configure Helium's signature layout, Zen mode, and theme.</p>
            </div>

            <div className="bg-[#141722] border border-[#232738] rounded-2xl divide-y divide-[#202434]">
              {/* Vertical Tabs Toggle */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Vertical Tabs Sidebar</h4>
                  <p className="text-xs text-slate-400">
                    Arc-style collapsible tab strip on the left side (patches/helium/ui/layout/vertical.patch)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appearance.verticalTabs}
                  onChange={(e) => onUpdateAppearance('verticalTabs', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Zen Mode */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Helium Zen Mode</h4>
                  <p className="text-xs text-slate-400">
                    Auto-hides top omnibox and tabs. Revealed smoothly on cursor edge hover (Cmd/Ctrl + Shift + A)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appearance.zenMode}
                  onChange={(e) => onUpdateAppearance('zenMode', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Centered Address Bar */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Centered Address Bar</h4>
                  <p className="text-xs text-slate-400">
                    Centers the Omnibox within the toolbar (patches/helium/ui/layout/centered-address-bar.patch)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appearance.centeredAddressBar}
                  onChange={(e) => onUpdateAppearance('centeredAddressBar', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Compact UI */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Compact UI Mode</h4>
                  <p className="text-xs text-slate-400">
                    Reduces toolbar and tabstrip heights to maximize readable screen real estate
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appearance.compactUI}
                  onChange={(e) => onUpdateAppearance('compactUI', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Window Controls Style */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Window Controls Style</h4>
                  <p className="text-xs text-slate-400">Choose macOS dots or Windows/Linux buttons</p>
                </div>
                <select
                  value={settings.appearance.windowFrameStyle}
                  onChange={(e) => onUpdateAppearance('windowFrameStyle', e.target.value)}
                  className="bg-[#1c202d] border border-[#2d3244] text-xs rounded-lg px-3 py-1.5 text-slate-200 outline-none"
                >
                  <option value="macos">macOS (Traffic Lights)</option>
                  <option value="linux">Linux / GNOME</option>
                  <option value="windows">Windows 11</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'privacy' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Fingerprinting Protection & Helium Noise</h3>
              <p className="text-xs text-slate-400">
                Helium injects non-destructive mathematical noise into fingerprinting APIs so each site sees consistent randomized signatures.
              </p>
            </div>

            <div className="bg-[#141722] border border-[#232738] rounded-2xl divide-y divide-[#202434]">
              {/* Canvas Noise */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-200">Canvas Noise Randomization</h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">noise/canvas.patch</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Injects subtle 2-bit noise into HTML5 Canvas toDataURL / getImageData to randomize hash output.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.noiseCanvas}
                  onChange={(e) => onUpdatePrivacy('noiseCanvas', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Audio Noise */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-200">WebAudio Acoustic Jitter</h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">noise/audio.patch</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Perturbs WebAudio AnalyserNode and AudioBuffer data to block acoustic fingerprinting.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.noiseAudio}
                  onChange={(e) => onUpdatePrivacy('noiseAudio', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Hardware Concurrency */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-200">Spoof Hardware Concurrency</h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">noise/hardware-concurrency.patch</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Reports 4 logical CPU cores via navigator.hardwareConcurrency.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.noiseHardwareConcurrency}
                  onChange={(e) => onUpdatePrivacy('noiseHardwareConcurrency', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* uBlock Origin */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-200">Built-in uBlock Origin Component</h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">ublock-install-as-component.patch</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Native C++ ad & tracker blocking with DNS uncloaking and zero extension overhead.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.uBlockEnabled}
                  onChange={(e) => onUpdatePrivacy('uBlockEnabled', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Split ClientHello */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-200">Split TLS ClientHello</h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">split-clienthello.patch</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Fragments initial TLS packet across TCP boundaries to bypass SNI censors.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.splitClientHello}
                  onChange={(e) => onUpdatePrivacy('splitClientHello', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'search' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Search & Native Bangs</h3>
              <p className="text-xs text-slate-400">
                Helium includes native C++ bang processing inside the omnibox without external redirects.
              </p>
            </div>

            <div className="bg-[#141722] border border-[#232738] rounded-2xl p-5 mb-6">
              <h4 className="text-sm font-medium text-slate-200 mb-2">Default Search Provider</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'duckduckgo', name: 'DuckDuckGo', desc: 'Privacy default' },
                  { id: 'brave', name: 'Brave Search', desc: 'Independent index' },
                  { id: 'kagi', name: 'Kagi', desc: 'Premium ad-free' },
                  { id: 'startpage', name: 'Startpage', desc: 'Google results, private' }
                ].map((engine) => (
                  <button
                    key={engine.id}
                    onClick={() => onUpdateSearch('defaultEngine', engine.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.search.defaultEngine === engine.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-[#181b26] border-[#252a3a] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-medium text-xs text-white">{engine.name}</div>
                    <div className="text-[10px] text-slate-400">{engine.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#141722] border border-[#232738] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-200">Installed Native Bangs (add-native-bangs.patch)</h4>
                <span className="text-xs text-indigo-400 font-mono">{BANGS_LIST.length} active bangs</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {BANGS_LIST.map((bang) => (
                  <div key={bang.prefix} className="flex items-center justify-between p-2.5 rounded-lg bg-[#181b26] border border-[#232736] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded text-[11px]">
                        {bang.prefix}
                      </span>
                      <span className="text-slate-200 font-medium">{bang.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{bang.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'performance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Performance</h3>
              <p className="text-xs text-slate-400">Memory saving by default and deep tab hibernation.</p>
            </div>

            <div className="bg-[#141722] border border-[#232738] rounded-2xl divide-y divide-[#202434]">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Memory Saver Active by Default</h4>
                  <p className="text-xs text-slate-400">
                    Frees memory from inactive tabs automatically (memory-saving-by-default.patch)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.performance.memorySaverDefault}
                  onChange={(e) => onUpdatePerformance('memorySaverDefault', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Infinite Tab Freezing</h4>
                  <p className="text-xs text-slate-400">
                    Drops execution context for background tabs while preserving scroll and DOM cache
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.performance.tabHibernation}
                  onChange={(e) => onUpdatePerformance('tabHibernation', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Low-Power Framerate Mode</h4>
                  <p className="text-xs text-slate-400">
                    Throttles compositor refresh on battery to maximize laptop endurance
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.performance.lowPowerFramerate}
                  onChange={(e) => onUpdatePerformance('lowPowerFramerate', e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'sync' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Helium Encrypted Vault</h3>
              <p className="text-xs text-slate-400">
                End-to-end encrypted synchronization without Google accounts (patches/helium/core/sync/vault-encryption.patch).
              </p>
            </div>

            <div className="bg-[#141722] border border-[#232738] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Local Encrypted Vault</h4>
                  <p className="text-xs text-slate-400">Key derivation: Argon2id • Cipher: AES-256-GCM</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Google account sync components have been completely stripped from Helium. Instead, bookmarks, history, and passwords are encrypted locally with your master passphrase and can be synchronized to self-hosted endpoints or local loopback servers.
              </p>

              <div className="p-3 rounded-xl bg-[#191d2a] border border-[#262c3c] flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Vault Status:</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Encrypted & Secured
                </span>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'i18n' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Helium Internationalization (i18n)</h3>
              <p className="text-xs text-slate-400">
                Helium features community translations across 80+ languages from i18n/languages.json and i18n/translations/.
              </p>
            </div>

            <div className="bg-[#141722] border border-[#232738] rounded-2xl p-5 mb-4">
              <h4 className="text-sm font-medium text-slate-200 mb-2">Select Language</h4>
              <select
                value={selectedLanguage.code}
                onChange={(e) => {
                  const found = LANGUAGES.find((l) => l.code === e.target.value);
                  if (found) setSelectedLanguage(found);
                }}
                className="w-full bg-[#1b1f2c] border border-[#2b3042] text-xs text-slate-100 rounded-xl px-3 py-2 outline-none mb-4"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.code})
                  </option>
                ))}
              </select>

              {selectedLanguage.sampleStrings && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#181b26] border border-[#232736]">
                    <div className="text-[10px] uppercase font-mono text-indigo-400 mb-1">
                      IDS_SETTINGS_PERFORMANCE_MEMORY_SAVER_MODE_SETTING_DESCRIPTION
                    </div>
                    <div className="text-xs text-slate-200">{selectedLanguage.sampleStrings.memorySaver}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181b26] border border-[#232736]">
                    <div className="text-[10px] uppercase font-mono text-indigo-400 mb-1">
                      IDS_SETTINGS_PERFORMANCE_BATTERY_SAVER_MODE_SETTING_DESCRIPTION
                    </div>
                    <div className="text-xs text-slate-200">{selectedLanguage.sampleStrings.batterySaver}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181b26] border border-[#232736]">
                    <div className="text-[10px] uppercase font-mono text-indigo-400 mb-1">
                      IDS_SETTINGS_NOISE_DESCRIPTION
                    </div>
                    <div className="text-xs text-slate-200">{selectedLanguage.sampleStrings.fingerprintingProtection}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeCategory === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">About Helium</h3>
              <p className="text-xs text-slate-400">The Chromium-based web browser made for people, with love.</p>
            </div>

            <div className="bg-[#141722] border border-[#232738] rounded-2xl p-6 text-xs text-slate-300 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-[#232736]">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xl">
                  He
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Helium Browser</h4>
                  <p className="text-slate-400">Version 0.19.2 (Chromium 155.0.8059.39-lite) • 64-bit</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[#181b26]">
                  <span className="text-slate-400 block mb-1">Base Platform</span>
                  <span className="font-medium text-slate-200">Chromium Official Source</span>
                </div>
                <div className="p-3 rounded-xl bg-[#181b26]">
                  <span className="text-slate-400 block mb-1">Ad Blocking</span>
                  <span className="font-medium text-slate-200">uBlock Origin Component</span>
                </div>
                <div className="p-3 rounded-xl bg-[#181b26]">
                  <span className="text-slate-400 block mb-1">De-googling Base</span>
                  <span className="font-medium text-slate-200">Ungoogled Chromium + Inox</span>
                </div>
                <div className="p-3 rounded-xl bg-[#181b26]">
                  <span className="text-slate-400 block mb-1">License</span>
                  <span className="font-medium text-slate-200">GPL-3.0 License</span>
                </div>
              </div>

              <p className="text-slate-400 pt-2">
                Helium is an open-source browser that strips away corporate telemetry, sponsored tiles, and AI gimmicks, delivering a fast, private, and customizable browsing experience.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
