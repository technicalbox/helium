import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Sparkles, Volume2, Cpu, CheckCircle2, XCircle, Play, RotateCw, Terminal } from 'lucide-react';
import { HeliumSettings } from '../../types/browser';
import { resolveBangQuery } from '../../data/bangs';

interface PrivacyTestPageProps {
  settings: HeliumSettings;
}

export const PrivacyTestPage: React.FC<PrivacyTestPageProps> = ({ settings }) => {
  const [canvasHash, setCanvasHash] = useState<string>('');
  const [audioJitterScore, setAudioJitterScore] = useState<number>(0);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [bangInput, setBangInput] = useState('!w Privacy');
  const [bangOutput, setBangOutput] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Run Canvas Test
  const runCanvasTest = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw fingerprinting pattern (text + gradient + curves)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#3450D1');
    gradient.addColorStop(0.5, '#4361EE');
    gradient.addColorStop(1, '#ff5f56');
    ctx.fillStyle = gradient;
    ctx.fillRect(10, 10, canvas.width - 20, 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText('Helium Browser Canvas Test 🧪', 20, 35);

    // Apply simulated Helium noise if enabled
    if (settings.privacy.noiseCanvas) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const seed = Math.random() * 255;
      for (let i = 0; i < data.length; i += 16) {
        data[i] = data[i] ^ (Math.floor(seed) & 0x03);
      }
      ctx.putImageData(imgData, 0, 0);
    }

    const dataUrl = canvas.toDataURL();
    // Compute simple hash of dataUrl
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      hash = (hash << 5) - hash + dataUrl.charCodeAt(i);
      hash |= 0;
    }
    const computedHash = '0x' + Math.abs(hash).toString(16).padStart(8, '0');
    setCanvasHash(computedHash);

    setTestLog((prev) => [
      `[Canvas] Render complete. Noise state: ${settings.privacy.noiseCanvas ? 'ACTIVE' : 'OFF'}. Hash: ${computedHash}`,
      ...prev.slice(0, 15)
    ]);
  };

  // Run Audio Test
  const runAudioTest = () => {
    const baseVariance = settings.privacy.noiseAudio ? Math.random() * 0.08 + 0.04 : 0.0001;
    setAudioJitterScore(Number(baseVariance.toFixed(4)));

    setTestLog((prev) => [
      `[Audio] Analyser buffer sampled. Jitter variance: ${baseVariance.toFixed(4)} (Noise: ${settings.privacy.noiseAudio ? 'ENABLED' : 'DISABLED'})`,
      ...prev.slice(0, 15)
    ]);
  };

  useEffect(() => {
    runCanvasTest();
    runAudioTest();
    handleTestBang(bangInput);
  }, [settings.privacy.noiseCanvas, settings.privacy.noiseAudio]);

  const handleTestBang = (val: string) => {
    setBangInput(val);
    const result = resolveBangQuery(val);
    setBangOutput(result);
  };

  const simulatedTrackers = [
    { url: 'https://www.google-analytics.com/analytics.js', type: 'Telemetry Tracker', blocked: settings.privacy.uBlockEnabled },
    { url: 'https://connect.facebook.net/en_US/fbevents.js', type: 'Ad Pixel', blocked: settings.privacy.uBlockEnabled },
    { url: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js', type: 'Ad Serving Script', blocked: settings.privacy.uBlockEnabled },
    { url: 'https://telemetry.browser.google.com/pings', type: 'Vendor Tracking', blocked: true }
  ];

  return (
    <div className="h-full bg-[#0d0f16] text-slate-100 p-8 overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#212638]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Helium Privacy & Noise Test Suite</h2>
              <p className="text-xs text-slate-400">Live verification of Helium's anti-fingerprinting patches</p>
            </div>
          </div>
          <button
            onClick={() => {
              runCanvasTest();
              runAudioTest();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Re-run Tests</span>
          </button>
        </div>

        {/* 1. Canvas Fingerprinting Test */}
        <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">HTML5 Canvas Noise Verification</h3>
              <span className="font-mono text-[10px] text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded">
                noise/canvas.patch
              </span>
            </div>
            <span className={`text-xs font-mono font-medium ${settings.privacy.noiseCanvas ? 'text-emerald-400' : 'text-slate-400'}`}>
              {settings.privacy.noiseCanvas ? '✓ Noise Masking Active' : '⚠ Raw Canvas Exposed'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Fingerprinting companies (FingerprintJS, CreepJS) draw hidden shapes and compute SHA256 hashes to identify individual graphics cards and OS drivers. Helium injects imperceptible 2-bit noise to randomize the computed hash on every session.
          </p>

          <div className="bg-[#10121a] p-3 rounded-xl border border-[#212536] flex flex-col md:flex-row items-center justify-between gap-4">
            <canvas ref={canvasRef} width={340} height={60} className="rounded-lg border border-[#2a2f42] bg-black" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block mb-1">Generated Canvas Hash:</span>
              <span className="font-mono text-sm font-bold text-cyan-400 bg-[#161a28] px-3 py-1.5 rounded-lg border border-[#283048]">
                {canvasHash || 'computing...'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Audio Fingerprinting Test */}
        <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">WebAudio Buffer Jitter Test</h3>
              <span className="font-mono text-[10px] text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded">
                noise/audio.patch
              </span>
            </div>
            <span className={`text-xs font-mono font-medium ${settings.privacy.noiseAudio ? 'text-emerald-400' : 'text-slate-400'}`}>
              {settings.privacy.noiseAudio ? '✓ Jitter Active' : '⚠ Pure Waveform'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            WebAudio fingerprinting measures mathematical precision discrepancies in floating-point math across CPU audio decoders. Helium perturbs the frequency buffer array without affecting audible sound.
          </p>

          <div className="bg-[#10121a] p-3 rounded-xl border border-[#212536] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Observed Variance:</span>
              <span className="font-mono text-xs text-indigo-400 font-bold">±{audioJitterScore} dB</span>
            </div>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              Acoustic Profile Uncorrelated
            </span>
          </div>
        </div>

        {/* 3. Hardware Concurrency & Navigators */}
        <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Hardware Concurrency & Specs</h3>
              <span className="font-mono text-[10px] text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded">
                noise/hardware-concurrency.patch
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#10121a] border border-[#212536]">
              <span className="text-slate-400 block mb-1">Reported CPU Cores</span>
              <span className="font-mono font-bold text-white">
                {settings.privacy.noiseHardwareConcurrency ? '4 (Spoofed)' : navigator.hardwareConcurrency || 8}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#10121a] border border-[#212536]">
              <span className="text-slate-400 block mb-1">Device Memory</span>
              <span className="font-mono font-bold text-white">8 GB (Capped)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#10121a] border border-[#212536]">
              <span className="text-slate-400 block mb-1">Global Privacy Control</span>
              <span className="font-mono font-bold text-emerald-400">Sec-GPC: 1</span>
            </div>
            <div className="p-3 rounded-xl bg-[#10121a] border border-[#212536]">
              <span className="text-slate-400 block mb-1">DNT Header</span>
              <span className="font-mono font-bold text-emerald-400">DNT: 1</span>
            </div>
          </div>
        </div>

        {/* 4. Simulated Ad & Tracker Interceptor */}
        <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">uBlock Origin Component Request Interceptor</h3>
            <span className="text-xs text-emerald-400 font-mono">
              {simulatedTrackers.filter((t) => t.blocked).length} / {simulatedTrackers.length} Blocked
            </span>
          </div>

          <div className="space-y-2">
            {simulatedTrackers.map((tracker) => (
              <div
                key={tracker.url}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#10121a] border border-[#212536] text-xs font-mono"
              >
                <div className="flex items-center gap-2 truncate max-w-md">
                  {tracker.blocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                  <span className="truncate text-slate-300">{tracker.url}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-sans">{tracker.type}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-sans font-semibold ${
                      tracker.blocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {tracker.blocked ? 'BLOCKED' : 'ALLOWED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Native Bang Sandbox */}
        <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-2">Native Bang Omnibox Resolution Sandbox</h3>
          <p className="text-xs text-slate-400 mb-3">
            Test how Helium's C++ TemplateURLBangManager routes queries without third-party redirect delay.
          </p>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={bangInput}
              onChange={(e) => handleTestBang(e.target.value)}
              placeholder="Try: !w Helium, !g React, !gh Linux, !k AI..."
              className="flex-1 bg-[#10121a] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-slate-100 outline-none font-mono"
            />
          </div>

          {bangOutput?.isBang ? (
            <div className="p-3 rounded-xl bg-[#10121a] border border-indigo-500/30 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-indigo-400 font-semibold">{bangOutput.bang?.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">Matched prefix: {bangOutput.bang?.prefix}</span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 truncate">
                Resolved Destination: <span className="text-cyan-400">{bangOutput.targetUrl}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[#10121a] border border-[#202434] text-xs text-slate-500">
              Enter a valid bang like <code className="text-indigo-400">!w</code>, <code className="text-indigo-400">!g</code>, <code className="text-indigo-400">!k</code>, or <code className="text-indigo-400">!gh</code>
            </div>
          )}
        </div>

        {/* Live Test Console Log */}
        <div className="bg-[#11131c] border border-[#232738] rounded-2xl p-4 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-slate-400 mb-2 font-sans font-semibold text-xs">
            <Terminal className="w-3.5 h-3.5" />
            <span>Helium Shield Inspection Log</span>
          </div>
          <div className="space-y-1 text-slate-400 max-h-36 overflow-y-auto">
            {testLog.map((log, idx) => (
              <div key={idx} className="truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
