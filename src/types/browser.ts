export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isPinned: boolean;
  isMuted: boolean;
  isHibernated: boolean;
  isLoading: boolean;
  audioPlaying?: boolean;
  history: string[];
  historyIndex: number;
}

export interface SearchEngine {
  id: string;
  name: string;
  icon: string;
  searchUrl: string;
  bang: string;
}

export interface BangItem {
  prefix: string;
  name: string;
  url: string;
  category: 'Search' | 'Development' | 'Knowledge' | 'Media' | 'Social';
  description: string;
}

export interface HeliumSettings {
  appearance: {
    zenMode: boolean;
    verticalTabs: boolean;
    compactUI: boolean;
    centeredAddressBar: boolean;
    roundedFrameCorners: boolean;
    fluentScrollbars: boolean;
    theme: 'dark' | 'light' | 'amoled';
    windowFrameStyle: 'macos' | 'linux' | 'windows';
  };
  privacy: {
    noiseCanvas: boolean;
    noiseAudio: boolean;
    noiseHardwareConcurrency: boolean;
    noiseClientRects: boolean;
    uBlockEnabled: boolean;
    cosmeticFiltering: boolean;
    globalPrivacyControl: boolean;
    preferHttps: boolean;
    disableEch: boolean;
    splitClientHello: boolean;
    spoofChromeUA: boolean;
  };
  search: {
    defaultEngine: string;
    nativeBangs: boolean;
    cleanOmniboxSuggestions: boolean;
  };
  performance: {
    memorySaverDefault: boolean;
    tabHibernation: boolean;
    tabHibernationMinutes: number;
    lowPowerFramerate: boolean;
  };
  sync: {
    vaultEnabled: boolean;
    vaultPasswordSet: boolean;
    lastSyncedTime?: string;
  };
}

export interface PatchItem {
  id: string;
  path: string;
  vendor: 'Helium Core' | 'Helium UI' | 'Helium Settings' | 'Ungoogled Chromium' | 'Brave' | 'Bromite' | 'Inox' | 'Iridium';
  category: 'Fingerprinting & Noise' | 'Zen Mode & UI Layout' | 'Adblocking & uBlock' | 'Privacy & De-googling' | 'Search & Bangs' | 'Tab Management' | 'Network & Security' | 'Performance';
  title: string;
  description: string;
  targetFiles: string[];
  diffExcerpt: string;
  impact: string;
}

export interface FlagItem {
  id: string;
  name: string;
  description: string;
  flagSwitch: string;
  category: 'Helium Features' | 'Privacy & Security' | 'Performance' | 'UI & Behavior' | 'Network & Security';
  state: 'default' | 'enabled' | 'disabled';
  defaultState: 'enabled' | 'disabled';
}
