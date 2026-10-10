import React, { useState, useEffect } from 'react';
import { TitleBar } from './components/BrowserChrome/TitleBar';
import { HorizontalTabBar } from './components/BrowserChrome/HorizontalTabBar';
import { VerticalTabBar } from './components/BrowserChrome/VerticalTabBar';
import { NavigationToolbar } from './components/BrowserChrome/NavigationToolbar';
import { NewTabPage } from './components/Pages/NewTabPage';
import { SettingsPage } from './components/Pages/SettingsPage';
import { FlagsPage } from './components/Pages/FlagsPage';
import { PrivacyTestPage } from './components/Pages/PrivacyTestPage';
import { PatchesPage } from './components/Pages/PatchesPage';
import { DownloadsPage } from './components/Pages/DownloadsPage';
import { WebpageViewer } from './components/Pages/WebpageViewer';
import { SidePanelContainer } from './components/SidePanel/SidePanelContainer';
import { Tab, HeliumSettings } from './types/browser';
import { Sparkles, Eye, X } from 'lucide-react';

const DEFAULT_SETTINGS: HeliumSettings = {
  appearance: {
    zenMode: false,
    verticalTabs: false,
    compactUI: false,
    centeredAddressBar: true,
    roundedFrameCorners: true,
    fluentScrollbars: true,
    theme: 'dark',
    windowFrameStyle: 'macos'
  },
  privacy: {
    noiseCanvas: true,
    noiseAudio: true,
    noiseHardwareConcurrency: true,
    noiseClientRects: true,
    uBlockEnabled: true,
    cosmeticFiltering: true,
    globalPrivacyControl: true,
    preferHttps: true,
    disableEch: false,
    splitClientHello: true,
    spoofChromeUA: true
  },
  search: {
    defaultEngine: 'duckduckgo',
    nativeBangs: true,
    cleanOmniboxSuggestions: true
  },
  performance: {
    memorySaverDefault: true,
    tabHibernation: true,
    tabHibernationMinutes: 15,
    lowPowerFramerate: true
  },
  sync: {
    vaultEnabled: true,
    vaultPasswordSet: true
  }
};

export default function App() {
  const [settings, setSettings] = useState<HeliumSettings>(() => {
    try {
      const saved = localStorage.getItem('helium_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      title: 'New Tab',
      url: 'helium://newtab',
      isPinned: false,
      isMuted: false,
      isHibernated: false,
      isLoading: false,
      history: ['helium://newtab'],
      historyIndex: 0
    },
    {
      id: 'tab-2',
      title: 'Privacy Test Suite',
      url: 'helium://privacy-test',
      isPinned: false,
      isMuted: false,
      isHibernated: false,
      isLoading: false,
      history: ['helium://privacy-test'],
      historyIndex: 0
    },
    {
      id: 'tab-3',
      title: 'Helium Patches',
      url: 'helium://patches',
      isPinned: false,
      isMuted: false,
      isHibernated: false,
      isLoading: false,
      history: ['helium://patches'],
      historyIndex: 0
    }
  ]);

  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [splitTabId, setSplitTabId] = useState<string>('tab-2');
  const [zenRevealed, setZenRevealed] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('helium_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  // Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + A -> Toggle Zen Mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setSettings((prev) => ({
          ...prev,
          appearance: { ...prev.appearance, zenMode: !prev.appearance.zenMode }
        }));
      }
      // Cmd/Ctrl + Shift + G -> Toggle Gemini Side Panel
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'G' || e.key === 'g')) {
        e.preventDefault();
        setIsSidePanelOpen((prev) => !prev);
      }
      // Cmd/Ctrl + T -> New Tab
      if ((e.metaKey || e.ctrlKey) && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        handleNewTab();
      }
      // Cmd/Ctrl + W -> Close Tab
      if ((e.metaKey || e.ctrlKey) && (e.key === 'w' || e.key === 'W')) {
        e.preventDefault();
        handleCloseTab(activeTabId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, tabs]);

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const splitTab = tabs.find((t) => t.id === splitTabId) || tabs[1] || currentTab;

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
    // Un-hibernate if hibernated
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isHibernated: false } : t))
    );
  };

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newId,
      title: 'New Tab',
      url: 'helium://newtab',
      isPinned: false,
      isMuted: false,
      isHibernated: false,
      isLoading: false,
      history: ['helium://newtab'],
      historyIndex: 0
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length <= 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  const handleToggleMute = (id: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isMuted: !t.isMuted } : t))
    );
  };

  const handleToggleHibernate = (id: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isHibernated: !t.isHibernated } : t))
    );
  };

  const handleCloseTabsToLeft = (id: string) => {
    const idx = tabs.findIndex((t) => t.id === id);
    if (idx <= 0) return;
    const remaining = tabs.slice(idx);
    setTabs(remaining);
    if (!remaining.some((t) => t.id === activeTabId)) {
      setActiveTabId(remaining[0].id);
    }
  };

  const getPageTitle = (url: string) => {
    if (url === 'helium://newtab') return 'New Tab';
    if (url === 'helium://settings') return 'Settings';
    if (url === 'helium://flags') return 'Flags & Experiments';
    if (url === 'helium://privacy-test') return 'Privacy Test Suite';
    if (url === 'helium://patches') return 'Helium Patches';
    if (url === 'helium://downloads') return 'Downloads';
    try {
      return new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
    } catch {
      return url;
    }
  };

  const handleNavigate = (url: string) => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId) {
          const nextHistory = [...t.history.slice(0, t.historyIndex + 1), url];
          return {
            ...t,
            url,
            title: getPageTitle(url),
            history: nextHistory,
            historyIndex: nextHistory.length - 1,
            isLoading: false
          };
        }
        return t;
      })
    );
  };

  const handleBack = () => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId && t.historyIndex > 0) {
          const nextIndex = t.historyIndex - 1;
          const nextUrl = t.history[nextIndex];
          return {
            ...t,
            historyIndex: nextIndex,
            url: nextUrl,
            title: getPageTitle(nextUrl)
          };
        }
        return t;
      })
    );
  };

  const handleForward = () => {
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id === activeTabId && t.historyIndex < t.history.length - 1) {
          const nextIndex = t.historyIndex + 1;
          const nextUrl = t.history[nextIndex];
          return {
            ...t,
            historyIndex: nextIndex,
            url: nextUrl,
            title: getPageTitle(nextUrl)
          };
        }
        return t;
      })
    );
  };

  const handleReload = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: true } : t))
    );
    setTimeout(() => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, isLoading: false } : t))
      );
    }, 400);
  };

  const renderPageContent = (url: string) => {
    if (url === 'helium://newtab') {
      return <NewTabPage onNavigate={handleNavigate} />;
    }
    if (url === 'helium://settings') {
      return (
        <SettingsPage
          settings={settings}
          onUpdateAppearance={(k, v) =>
            setSettings((p) => ({ ...p, appearance: { ...p.appearance, [k]: v } }))
          }
          onUpdatePrivacy={(k, v) =>
            setSettings((p) => ({ ...p, privacy: { ...p.privacy, [k]: v } }))
          }
          onUpdateSearch={(k, v) =>
            setSettings((p) => ({ ...p, search: { ...p.search, [k]: v } }))
          }
          onUpdatePerformance={(k, v) =>
            setSettings((p) => ({ ...p, performance: { ...p.performance, [k]: v } }))
          }
          onUpdateSync={(k, v) =>
            setSettings((p) => ({ ...p, sync: { ...p.sync, [k]: v } }))
          }
        />
      );
    }
    if (url === 'helium://flags') {
      return <FlagsPage />;
    }
    if (url === 'helium://privacy-test') {
      return <PrivacyTestPage settings={settings} />;
    }
    if (url === 'helium://patches') {
      return <PatchesPage />;
    }
    if (url === 'helium://downloads') {
      return <DownloadsPage />;
    }
    return <WebpageViewer url={url} settings={settings} />;
  };

  const isZenActive = settings.appearance.zenMode;

  return (
    <div
      className={`h-screen w-screen flex flex-col bg-[#0b0d13] text-slate-100 overflow-hidden select-none ${
        settings.appearance.roundedFrameCorners ? 'p-1.5' : ''
      }`}
    >
      <div className="flex-1 flex flex-col h-full rounded-xl overflow-hidden border border-[#202434] bg-[#0e1017] shadow-2xl relative">
        {/* Top Hover Trigger Area for Zen Mode (Helium kZenModeRevealTriggerThickness = 6px) */}
        {isZenActive && (
          <div
            onMouseEnter={() => setZenRevealed(true)}
            className="absolute top-0 left-0 right-0 h-3 z-50 cursor-pointer"
          />
        )}

        {/* Browser Top Chrome (TitleBar + TabBar + NavigationToolbar) */}
        <div
          onMouseLeave={() => {
            if (isZenActive) setZenRevealed(false);
          }}
          className={`flex flex-col z-30 transition-all duration-200 ${
            isZenActive && !zenRevealed
              ? '-translate-y-full opacity-0 pointer-events-none max-h-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Title Bar */}
          <TitleBar
            settings={settings}
            onUpdateAppearance={(k, v) =>
              setSettings((p) => ({ ...p, appearance: { ...p.appearance, [k]: v } }))
            }
            activeTabTitle={currentTab.title}
            tabCount={tabs.length}
          />

          {/* Horizontal Tab Bar (if not vertical mode) */}
          {!settings.appearance.verticalTabs && (
            <HorizontalTabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onSelectTab={handleSelectTab}
              onCloseTab={handleCloseTab}
              onNewTab={handleNewTab}
              onToggleMute={handleToggleMute}
              onToggleHibernate={handleToggleHibernate}
              onCloseTabsToLeft={handleCloseTabsToLeft}
            />
          )}

          {/* Navigation Toolbar & Omnibox */}
          <NavigationToolbar
            currentTab={currentTab}
            settings={settings}
            canGoBack={currentTab.historyIndex > 0}
            canGoForward={currentTab.historyIndex < currentTab.history.length - 1}
            onNavigate={handleNavigate}
            onBack={handleBack}
            onForward={handleForward}
            onReload={handleReload}
            onHome={() => handleNavigate('helium://newtab')}
            onToggleZen={() =>
              setSettings((p) => ({
                ...p,
                appearance: { ...p.appearance, zenMode: !p.appearance.zenMode }
              }))
            }
            onToggleSplit={() => setIsSplit(!isSplit)}
            isSplit={isSplit}
            onOpenSettings={() => handleNavigate('helium://settings')}
            onUpdatePrivacy={(k, v) =>
              setSettings((p) => ({ ...p, privacy: { ...p.privacy, [k]: v } }))
            }
            onNewTab={handleNewTab}
            onToggleSidePanel={() => setIsSidePanelOpen((prev) => !prev)}
            isSidePanelOpen={isSidePanelOpen}
          />
        </div>

        {/* Floating Zen Indicator when Zen Mode is on & chrome is hidden */}
        {isZenActive && !zenRevealed && (
          <div className="absolute top-2 right-3 z-40 flex items-center gap-1.5 bg-[#171a26]/80 backdrop-blur border border-[#2d3348] text-indigo-300 text-[10px] font-medium px-2 py-1 rounded-full shadow-lg">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Zen Mode (Hover top or press Cmd+Shift+A)</span>
            <button
              onClick={() =>
                setSettings((p) => ({
                  ...p,
                  appearance: { ...p.appearance, zenMode: false }
                }))
              }
              className="p-0.5 hover:text-white rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Browser Body Area (Vertical tabs sidebar + Content Views + Ask Gemini Side Panel) */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Vertical Tabs Sidebar (if enabled) */}
          {settings.appearance.verticalTabs && !isZenActive && (
            <VerticalTabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onSelectTab={handleSelectTab}
              onCloseTab={handleCloseTab}
              onNewTab={handleNewTab}
              onToggleMute={handleToggleMute}
              onToggleHibernate={handleToggleHibernate}
              onNavigateInternal={(url) => handleNavigate(url)}
              onToggleSidePanel={() => setIsSidePanelOpen((prev) => !prev)}
              isSidePanelOpen={isSidePanelOpen}
            />
          )}

          {/* Main Content Area: Single or Split View */}
          <div className="flex-1 flex overflow-hidden">
            {/* Primary View */}
            <div className={`h-full overflow-hidden ${isSplit ? 'w-1/2 border-r border-[#202434]' : 'w-full'}`}>
              {renderPageContent(currentTab.url)}
            </div>

            {/* Split Screen Secondary View (Helium multi-contents-view.patch) */}
            {isSplit && (
              <div className="w-1/2 h-full flex flex-col overflow-hidden bg-[#0e1017]">
                <div className="h-8 bg-[#13151f] border-b border-[#202434] px-3 flex items-center justify-between text-xs text-slate-400 select-none">
                  <span className="truncate font-medium text-slate-300">{splitTab.title}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={splitTabId}
                      onChange={(e) => setSplitTabId(e.target.value)}
                      className="bg-[#1b1f2c] border border-[#2b3042] text-[11px] rounded px-2 py-0.5 text-slate-300 outline-none"
                    >
                      {tabs.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setIsSplit(false)}
                      className="p-1 hover:bg-[#202434] rounded text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  {renderPageContent(splitTab.url)}
                </div>
              </div>
            )}
          </div>

          {/* Native Ask Gemini Side Panel (SidePanelContainer) */}
          <SidePanelContainer
            isOpen={isSidePanelOpen}
            onClose={() => setIsSidePanelOpen(false)}
            activeTab={currentTab}
          />
        </div>
      </div>
    </div>
  );
}
