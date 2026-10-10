import React, { useState } from 'react';
import { Download, Terminal, Apple, Monitor, Laptop, CheckCircle2, Copy, Check, ExternalLink, Shield, Package, Cpu } from 'lucide-react';
import { HeliumLogo } from '../HeliumLogo';

export const DownloadsPage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedLinuxTab, setSelectedLinuxTab] = useState<'appimage' | 'deb' | 'rpm' | 'arch' | 'local'>('local');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gnFlags = `# Helium Release GN Configuration
chrome_pgo_phase=0
clang_use_chrome_plugins=false
disable_fieldtrial_testing_config=true
enable_hangout_services_extension=false
enable_mdns=false
enable_remoting=false
enable_reporting=false
enable_service_discovery=false
enable_widevine=true
exclude_unwind_tables=true
google_api_key=""
google_default_client_id=""
google_default_client_secret=""
safe_browsing_mode=0
treat_warnings_as_errors=false
use_official_google_api_keys=false
use_unofficial_version_number=false`;

  const linuxCommands = {
    local: `# Install & launch THIS updated Helium build (with Ask Gemini & Zen Mode) on Linux:
# 1. Run the included Linux desktop installer script:
bash install-linux.sh

# 2. Or start manually:
npm install
npm run build
npm start

# This automatically registers ~/.local/share/applications/helium-browser.desktop
# and ~/.local/bin/helium-browser on your Linux system!`,
    appimage: `# 1. Download the latest official universal Linux AppImage:
curl -LO https://github.com/imputnet/helium-linux/releases/latest/download/Helium-x86_64.AppImage

# 2. Make it executable:
chmod +x Helium-x86_64.AppImage

# 3. Launch Helium Browser:
./Helium-x86_64.AppImage`,
    deb: `# Ubuntu / Debian / Linux Mint (.deb package)
curl -LO https://github.com/imputnet/helium-linux/releases/latest/download/helium_amd64.deb

# Install via APT (automatically resolves dependencies):
sudo apt install ./helium_amd64.deb

# Launch Helium:
helium`,
    rpm: `# Fedora / RHEL / openSUSE (.rpm package)
curl -LO https://github.com/imputnet/helium-linux/releases/latest/download/helium.x86_64.rpm

# Install via DNF:
sudo dnf install ./helium.x86_64.rpm

# Launch Helium:
helium`,
    arch: `# Arch Linux / Manjaro / EndeavourOS (via AUR)
yay -S helium-bin

# Or using paru:
paru -S helium-bin

# Launch:
helium`
  };

  return (
    <div className="h-full bg-[#0d0f17] text-slate-100 p-8 overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <HeliumLogo size={42} />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white tracking-tight">Helium Browser for Linux</h1>
              <span className="text-xs text-indigo-400 font-mono">v0.19.2 (Chromium 155.0.8059.39)</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs max-w-lg mx-auto">
            Official precompiled binaries for Linux distributions with built-in uBlock Origin, Zen mode, and anti-fingerprinting noise shields.
          </p>
        </div>

        {/* Highlighted Linux Installation Terminal Section */}
        <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#23283a]">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Linux Package Quick Install</h2>
            </div>
            <a
              href="https://github.com/imputnet/helium-linux/releases/latest"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>GitHub Releases Page</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          {/* Distro Tabs */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {[
              { id: 'local', label: '⭐ Install This Updated Build' },
              { id: 'appimage', label: 'Universal AppImage' },
              { id: 'deb', label: 'Debian / Ubuntu (.deb)' },
              { id: 'rpm', label: 'Fedora / RHEL (.rpm)' },
              { id: 'arch', label: 'Arch Linux (AUR)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLinuxTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedLinuxTab === tab.id
                    ? 'bg-indigo-600/25 border border-indigo-500/50 text-white font-semibold'
                    : 'bg-[#1b1f2e] text-slate-400 hover:text-slate-200 border border-[#262c3e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Terminal Command Snippet Box */}
          <div className="relative bg-[#0d0f17] border border-[#23283a] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#151825] px-4 py-2 border-b border-[#23283a]">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>bash</span>
              </div>
              <button
                onClick={() => copyToClipboard(linuxCommands[selectedLinuxTab], selectedLinuxTab)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-md bg-[#202538] hover:bg-[#282f46] transition-colors"
              >
                {copiedKey === selectedLinuxTab ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto whitespace-pre">
              {linuxCommands[selectedLinuxTab]}
            </pre>
          </div>
        </div>

        {/* All Supported Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Linux Card */}
          <div className="bg-[#141724] border border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative">
            <span className="absolute -top-2.5 right-4 text-[10px] bg-indigo-600 text-white font-semibold px-2 py-0.5 rounded-full">
              Your Platform
            </span>
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Linux Binaries</h3>
              <p className="text-xs text-slate-400 mb-4">
                Available as AppImage, native .deb, .rpm, and Arch Linux package.
              </p>
            </div>
            <div className="space-y-2">
              <a
                href="https://github.com/imputnet/helium-linux/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download for Linux</span>
              </a>
              <span className="text-[10px] text-slate-400 block text-center font-mono">
                helium.computer/linux
              </span>
            </div>
          </div>

          {/* macOS */}
          <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white mb-3">
                <Apple className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">macOS</h3>
              <p className="text-xs text-slate-400 mb-4">Apple Silicon (M1–M4) & Intel x86_64</p>
            </div>
            <div className="space-y-2">
              <a
                href="https://github.com/imputnet/helium-macos/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#1d2232] hover:bg-[#252b40] text-slate-200 text-xs font-medium transition-colors border border-[#2c3348]"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Download .dmg</span>
              </a>
              <span className="text-[10px] text-slate-500 block text-center">Primary packaging target</span>
            </div>
          </div>

          {/* Windows */}
          <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white mb-3">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Windows</h3>
              <p className="text-xs text-slate-400 mb-4">Windows 10 / 11 64-bit & ARM64</p>
            </div>
            <div className="space-y-2">
              <a
                href="https://github.com/imputnet/helium-windows/releases/latest"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#1d2232] hover:bg-[#252b40] text-slate-200 text-xs font-medium transition-colors border border-[#2c3348]"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Download .exe / .zip</span>
              </a>
              <span className="text-[10px] text-slate-500 block text-center">Installer or Portable</span>
            </div>
          </div>
        </div>

        {/* Building From Source Instructions */}
        <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">flags.gn Build Configuration for Linux</h3>
            </div>
            <button
              onClick={() => copyToClipboard(gnFlags, 'gn')}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#1f2334] hover:bg-[#282e44] text-slate-200 transition-colors"
            >
              {copiedKey === 'gn' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === 'gn' ? 'Copied' : 'Copy flags.gn'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            When building from source using the packaging repo (<code>github.com/imputnet/helium-linux</code>), these GN arguments configure de-googling, Widevine DRM, and security settings:
          </p>

          <pre className="p-4 bg-[#10121a] border border-[#222738] rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
            {gnFlags}
          </pre>
        </div>
      </div>
    </div>
  );
};
