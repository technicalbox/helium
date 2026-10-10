import React, { useState } from 'react';
import { Search, RotateCcw, AlertTriangle, Check, Flag } from 'lucide-react';
import { HELIUM_FLAGS } from '../../data/flags';
import { FlagItem } from '../../types/browser';

interface FlagsPageProps {
  onRestartNotice?: () => void;
}

export const FlagsPage: React.FC<FlagsPageProps> = () => {
  const [flags, setFlags] = useState<FlagItem[]>(HELIUM_FLAGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanged, setHasChanged] = useState(false);

  const filteredFlags = flags.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.flagSwitch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStateChange = (id: string, newState: 'default' | 'enabled' | 'disabled') => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, state: newState } : f))
    );
    setHasChanged(true);
  };

  const handleResetAll = () => {
    setFlags(HELIUM_FLAGS.map((f) => ({ ...f, state: 'default' })));
    setHasChanged(true);
  };

  return (
    <div className="h-full bg-[#0f1118] text-slate-100 flex flex-col select-none overflow-hidden">
      {/* Flags Header */}
      <div className="bg-[#131622] border-b border-[#212638] p-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Experiments & Flags (helium://flags)</h2>
                <p className="text-xs text-slate-400">Warning: Experimental features ahead</p>
              </div>
            </div>

            <button
              onClick={handleResetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c202e] hover:bg-[#252b3e] text-slate-300 text-xs border border-[#2d3448] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all to default</span>
            </button>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs mb-4">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <p>
              By enabling these features, you could compromise browser stability or site compatibility. Helium defaults are pre-tuned for maximum privacy and performance.
            </p>
          </div>

          {/* Search Flags */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments and switches (e.g. noise, bangs, framerate)..."
              className="w-full bg-[#181c28] border border-[#2b3146] focus:border-indigo-500 text-xs rounded-xl pl-9 pr-4 py-2 text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Flags List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredFlags.map((flag) => (
            <div
              key={flag.id}
              className="p-4 rounded-xl bg-[#141724] border border-[#23283a] flex items-center justify-between gap-4 hover:border-[#2e354c] transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-slate-100">{flag.name}</h4>
                  <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {flag.flagSwitch}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                  {flag.description}
                </p>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  Category: {flag.category}
                </span>
              </div>

              {/* Selector */}
              <div className="flex-shrink-0">
                <select
                  value={flag.state}
                  onChange={(e) => handleStateChange(flag.id, e.target.value as any)}
                  className="bg-[#1b202e] border border-[#2e364c] text-xs text-slate-200 rounded-lg px-3 py-1.5 outline-none font-medium"
                >
                  <option value="default">Default</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          ))}

          {filteredFlags.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No flags matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Relaunch Banner */}
      {hasChanged && (
        <div className="bg-[#181b28] border-t border-indigo-500/30 p-4 shadow-xl flex items-center justify-between max-w-4xl mx-auto w-full rounded-t-2xl">
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-white">Your changes will take effect</span> the next time you relaunch Helium.
          </div>
          <button
            onClick={() => setHasChanged(false)}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            Relaunch Helium
          </button>
        </div>
      )}
    </div>
  );
};
