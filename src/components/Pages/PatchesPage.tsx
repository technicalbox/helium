import React, { useState } from 'react';
import { GitBranch, Search, Filter, FileText, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { HELIUM_PATCHES } from '../../data/patches';
import { PatchItem } from '../../types/browser';

export const PatchesPage: React.FC = () => {
  const [selectedPatch, setSelectedPatch] = useState<PatchItem>(HELIUM_PATCHES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  const vendors = ['All', 'Helium Core', 'Helium UI', 'Ungoogled Chromium'];

  const filteredPatches = HELIUM_PATCHES.filter((patch) => {
    const matchesSearch =
      patch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patch.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVendor = selectedVendor === 'All' || patch.vendor === selectedVendor;
    return matchesSearch && matchesVendor;
  });

  const handleCopyDiff = () => {
    navigator.clipboard.writeText(selectedPatch.diffExcerpt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full bg-[#0d0f17] text-slate-100 flex select-none overflow-hidden">
      {/* Patches Explorer Sidebar */}
      <aside className="w-80 bg-[#12141d] border-r border-[#202434] flex flex-col h-full">
        <div className="p-4 border-b border-[#202434]">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Helium Patchset Explorer</h2>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patches (zen, noise, bangs)..."
              className="w-full bg-[#171a25] border border-[#272d3e] focus:border-indigo-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 outline-none"
            />
          </div>

          {/* Vendor Filter Buttons */}
          <div className="flex flex-wrap gap-1">
            {vendors.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVendor(v)}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                  selectedVendor === v
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#181b26] text-slate-400 hover:text-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Patches List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredPatches.map((patch) => {
            const isSelected = selectedPatch.id === patch.id;
            return (
              <div
                key={patch.id}
                onClick={() => setSelectedPatch(patch)}
                className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                  isSelected
                    ? 'bg-indigo-600/15 border border-indigo-500/30 text-white'
                    : 'text-slate-400 hover:bg-[#161824] hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate text-[11.5px] text-slate-200">
                    {patch.title}
                  </span>
                  <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[#1c202e] text-indigo-300 font-mono">
                    {patch.vendor}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 truncate mb-1">{patch.description}</p>
                <span className="text-[9.5px] font-mono text-slate-500 block truncate">{patch.path}</span>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-[#202434] text-[11px] text-slate-500 flex items-center justify-between">
          <span>{filteredPatches.length} patches found</span>
          <span className="font-mono">GPL-3.0</span>
        </div>
      </aside>

      {/* Main Diff & Details Inspector */}
      <main className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
        <div className="max-w-4xl w-full mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                {selectedPatch.path}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">
                Applied to Chromium 155
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">{selectedPatch.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedPatch.description}</p>

            <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-[#212536]">
              <div>
                <span className="text-slate-400 block mb-1 font-medium">Vendor Category:</span>
                <span className="text-white font-medium">{selectedPatch.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1 font-medium">Architectural Impact:</span>
                <span className="text-indigo-300 font-medium">{selectedPatch.impact}</span>
              </div>
            </div>
          </div>

          {/* Target Modified Files */}
          <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Modified Chromium Files ({selectedPatch.targetFiles.length})
            </h3>
            <div className="space-y-1">
              {selectedPatch.targetFiles.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-[#10121a] px-3 py-1.5 rounded-lg border border-[#1f2334]">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diff Viewer */}
          <div className="bg-[#10121a] border border-[#232738] rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#161924] px-4 py-2.5 flex items-center justify-between border-b border-[#232738]">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                <span>Unified Diff Patch</span>
              </span>
              <button
                onClick={handleCopyDiff}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-[#202536] hover:bg-[#282f44] text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Diff'}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-slate-300">
              {selectedPatch.diffExcerpt.split('\n').map((line, idx) => {
                let color = 'text-slate-300';
                if (line.startsWith('+')) color = 'text-emerald-400 bg-emerald-500/10 px-1 rounded';
                else if (line.startsWith('-')) color = 'text-rose-400 bg-rose-500/10 px-1 rounded';
                else if (line.startsWith('@')) color = 'text-cyan-400 font-bold';
                return (
                  <div key={idx} className={color}>
                    {line}
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};
