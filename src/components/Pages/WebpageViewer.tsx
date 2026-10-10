import React from 'react';
import { ShieldCheck, Lock, ExternalLink, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeliumSettings } from '../../types/browser';

interface WebpageViewerProps {
  url: string;
  settings: HeliumSettings;
}

export const WebpageViewer: React.FC<WebpageViewerProps> = ({ url, settings }) => {
  let hostname = 'website.com';
  try {
    hostname = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
  } catch {
    hostname = url;
  }

  // Pre-configured rich mock content for common search engines or sites
  const isWikipedia = hostname.includes('wikipedia.org');
  const isGithub = hostname.includes('github.com');
  const isHackerNews = hostname.includes('ycombinator.com');
  const isDuckDuckGo = hostname.includes('duckduckgo.com');

  return (
    <div className="h-full bg-[#0e1017] text-slate-200 flex flex-col overflow-y-auto select-none">
      {/* Helium Privacy Banner for Web Sessions */}
      <div className="bg-[#121520] border-b border-[#212638] px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">Helium Protection:</span>
          <span className="text-emerald-400 font-mono">14 Trackers Blocked</span>
          <span className="text-slate-500">•</span>
          <span className="text-indigo-400 font-mono">Canvas & Audio Noise Injected</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>HTTPS Upgraded (prefer-https-by-default)</span>
        </div>
      </div>

      {/* Web Page Content Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-8">
        {isWikipedia && (
          <article className="space-y-4">
            <div className="border-b border-[#242938] pb-4">
              <span className="text-xs text-indigo-400 uppercase font-mono tracking-wider">Wikipedia Free Encyclopedia</span>
              <h1 className="text-3xl font-bold text-white mt-1">Browser Fingerprinting</h1>
              <p className="text-xs text-slate-400 mt-1">From Wikipedia, the free encyclopedia</p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong>Device fingerprinting</strong> is information collected about a remote computing device for the purpose of identification. Fingerprints can be used to fully or partially identify individual users or devices even when cookies are turned off.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike HTTP cookies, which are stored on the user's computer and can be cleared, browser fingerprinting uses deterministic properties of the client machine—such as screen dimensions, installed fonts, Canvas rendering nuances, and WebAudio oscillator outputs—to profile user behavior.
            </p>
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200">
              <strong>Helium Defense Note:</strong> Helium solves this problem via mathematical noise injection (patches/helium/core/noise/*.patch), ensuring that each site observes unique, uncorrelated fingerprint hashes across browsing sessions without breaking site layout.
            </div>
          </article>
        )}

        {isGithub && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-[#242938] pb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-mono font-bold text-white">
                He
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">technicalbox / helium</h1>
                <p className="text-xs text-slate-400">The Chromium-based web browser made for people, with love.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#151824] rounded-xl border border-[#232838]">
                <span className="text-slate-400 block mb-1">Patches</span>
                <span className="text-white font-mono font-bold">370+ unified diffs</span>
              </div>
              <div className="p-3 bg-[#151824] rounded-xl border border-[#232838]">
                <span className="text-slate-400 block mb-1">Languages</span>
                <span className="text-white font-mono font-bold">80+ translations</span>
              </div>
              <div className="p-3 bg-[#151824] rounded-xl border border-[#232838]">
                <span className="text-slate-400 block mb-1">License</span>
                <span className="text-white font-mono font-bold">GPL-3.0</span>
              </div>
            </div>
          </div>
        )}

        {isHackerNews && (
          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#ff6600] text-black px-3 py-2 font-bold font-sans flex items-center justify-between rounded-lg">
              <span>Hacker News</span>
              <span className="text-xs font-normal">new | past | comments | ask | show | jobs</span>
            </div>
            <div className="space-y-2 pt-2">
              {[
                { title: 'Helium: A minimalist, privacy-first Chromium browser with native bangs', points: 412, author: 'imputnet', hours: 3 },
                { title: 'Why Canvas noise injection defeats device fingerprinting without visual breakage', points: 289, author: 'secdev', hours: 5 },
                { title: 'uBlock Origin integrated as a native browser component', points: 512, author: 'gorhill_fan', hours: 8 }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#141724] border border-[#212638]">
                  <div className="text-slate-100 font-sans font-medium text-sm mb-1">{idx + 1}. {item.title}</div>
                  <div className="text-[11px] text-slate-400">
                    {item.points} points by {item.author} {item.hours} hours ago | discuss
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isWikipedia && !isGithub && !isHackerNews && (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Globe className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">{hostname}</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You are browsing in Helium's sandbox with uBlock Origin ad filtering and anti-fingerprinting noise shields active.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero Google telemetry • Protected Session</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
