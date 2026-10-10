import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, Sparkles, Volume2, Eye, Cpu, Zap, ExternalLink } from 'lucide-react';
import { HeliumSettings } from '../types/browser';

interface ShieldPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  settings: HeliumSettings;
  onUpdatePrivacy: (key: keyof HeliumSettings['privacy'], value: boolean) => void;
  currentUrl: string;
}

export const ShieldPopover: React.FC<ShieldPopoverProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdatePrivacy,
  currentUrl
}) => {
  if (!isOpen) return null;

  const isInternal = currentUrl.startsWith('helium://');

  return (
    <div className="absolute right-0 top-11 w-84 bg-[#181b24] border border-[#2d3244] rounded-xl shadow-2xl z-50 p-4 text-xs select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#282c3c]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 text-sm">Helium Privacy Shield</h4>
            <p className="text-[11px] text-slate-400">
              {isInternal ? 'Internal Secure Page' : new URL(currentUrl.startsWith('http') ? currentUrl : 'https://' + currentUrl).hostname}
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Shield Active
        </span>
      </div>

      {/* uBlock Origin Stat Card */}
      <div className="my-3 p-3 rounded-lg bg-[#11131a] border border-[#232734]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-slate-200">uBlock Origin Component</span>
          </div>
          <button
            onClick={() => onUpdatePrivacy('uBlockEnabled', !settings.privacy.uBlockEnabled)}
            className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              settings.privacy.uBlockEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mb-2">
          Built-in C++ native DNS uncloaking and ad filter lists (EasyList, Peter Lowe, Helium rules).
        </p>
        <div className="flex items-center justify-between text-[11px] bg-[#1a1e2a] px-2 py-1.5 rounded">
          <span className="text-slate-400">Trackers & Ads Blocked:</span>
          <span className="font-mono font-semibold text-emerald-400">{settings.privacy.uBlockEnabled ? '14 blocked' : '0 (disabled)'}</span>
        </div>
      </div>

      {/* Helium Noise Protections */}
      <div className="space-y-2 mb-3">
        <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Anti-Fingerprinting Noise
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#131620] hover:bg-[#1a1e2b] transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <div>
              <div className="text-slate-200 font-medium">Canvas Randomization</div>
              <div className="text-[10px] text-slate-400">2-bit noise on toDataURL / getImageData</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.privacy.noiseCanvas}
            onChange={(e) => onUpdatePrivacy('noiseCanvas', e.target.checked)}
            className="rounded accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#131620] hover:bg-[#1a1e2b] transition-colors">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <div>
              <div className="text-slate-200 font-medium">WebAudio Jitter</div>
              <div className="text-[10px] text-slate-400">Defeats oscillator frequency sniffing</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.privacy.noiseAudio}
            onChange={(e) => onUpdatePrivacy('noiseAudio', e.target.checked)}
            className="rounded accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-[#131620] hover:bg-[#1a1e2b] transition-colors">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <div>
              <div className="text-slate-200 font-medium">Hardware Concurrency</div>
              <div className="text-[10px] text-slate-400">Spoofed to 4 cores</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.privacy.noiseHardwareConcurrency}
            onChange={(e) => onUpdatePrivacy('noiseHardwareConcurrency', e.target.checked)}
            className="rounded accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-[#282c3c] flex items-center justify-between text-[11px] text-slate-400">
        <span>Global Privacy Control: On</span>
        <span className="text-indigo-400">0 Google pings</span>
      </div>
    </div>
  );
};
