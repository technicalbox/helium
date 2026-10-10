import { FlagItem } from '../types/browser';

export const HELIUM_FLAGS: FlagItem[] = [
  {
    id: 'helium-noise-canvas',
    name: 'Helium Noise: HTML5 Canvas Randomization',
    description: 'Injects pseudo-random 2-bit mathematical noise into Canvas toDataURL and getImageData calls. Prevents cross-site canvas fingerprinting while remaining imperceptible to the human eye.',
    flagSwitch: '--helium-noise-canvas',
    category: 'Privacy & Security',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'helium-noise-audio',
    name: 'Helium Noise: WebAudio Buffer Jitter',
    description: 'Introduces micro-jitter to WebAudio AnalyserNode and AudioBuffer channels, neutralizing acoustic hardware fingerprinting vectors.',
    flagSwitch: '--helium-noise-audio',
    category: 'Privacy & Security',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'helium-noise-hardware-concurrency',
    name: 'Helium Noise: Spoof Hardware Concurrency',
    description: 'Reports standard 4 or 8 CPU logical cores via navigator.hardwareConcurrency instead of genuine system core count.',
    flagSwitch: '--helium-noise-hardware-concurrency',
    category: 'Privacy & Security',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'helium-noise-client-rects',
    name: 'Fingerprinting Protection: Client Rects & MeasureText',
    description: 'Adds microscopic non-linear offsets to Element.getBoundingClientRect and CanvasRenderingContext2D.measureText to defeat font and DOM geometry fingerprinting.',
    flagSwitch: '--fingerprinting-client-rects-noise',
    category: 'Privacy & Security',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'native-bangs',
    name: 'Native Omnibox Bang Searches',
    description: 'Interprets bang prefixes (!g, !w, !k, !gh, !yt) natively inside the omnibox parser without external redirect hops or latency.',
    flagSwitch: '--enable-helium-native-bangs',
    category: 'Helium Features',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'zen-mode',
    name: 'Helium Zen Mode (Distraction-Free)',
    description: 'Enables immersive Zen mode with auto-hiding top bar, vertical tabs, and smooth reveal animation upon edge proximity.',
    flagSwitch: '--enable-helium-zen-mode',
    category: 'UI & Behavior',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'low-power-framerate',
    name: 'Low-Power Framerate Throttling',
    description: 'Reduces compositor display refresh rate on battery power or when windows are partially occluded to extend laptop battery life.',
    flagSwitch: '--add-low-power-framerate',
    category: 'Performance',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'split-clienthello',
    name: 'Split TLS ClientHello Packets',
    description: 'Fragments the TLS ClientHello packet across TCP segment boundaries to bypass restrictive SNI-based state inspection and censorship.',
    flagSwitch: '--split-clienthello',
    category: 'Network & Security',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'disable-ech',
    name: 'Disable Encrypted Client Hello (ECH)',
    description: 'Allows toggling ECH compatibility for networks or proxies that reject outer SNI values.',
    flagSwitch: '--disable-ech',
    category: 'Network & Security',
    state: 'disabled',
    defaultState: 'disabled'
  },
  {
    id: 'middle-click-autoscroll',
    name: 'Middle Click Autoscroll on macOS / Linux',
    description: 'Brings Windows-style smooth middle-click omni-directional autoscrolling cursor to macOS and Linux builds.',
    flagSwitch: '--enable-middle-click-autoscroll',
    category: 'UI & Behavior',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'infinite-tab-freezing',
    name: 'Aggressive Tab Freezing & Hibernation',
    description: 'Enables deep memory hibernation for background tabs after inactivity, preserving complete session state while releasing V8 heap.',
    flagSwitch: '--enable-infinite-tab-freezing',
    category: 'Performance',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'webrtc-handling-policy',
    name: 'WebRTC Default Handling: Prevent Local IP Leak',
    description: 'Forces WebRTC ICE candidates to restrict binding to default public routing interfaces, hiding LAN private IPv4/IPv6 addresses.',
    flagSwitch: '--webrtc-ip-handling-policy=disable_non_proxied_udp',
    category: 'Privacy & Security',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'spoof-chrome-ua',
    name: 'Spoof Chrome User-Agent Brand Header',
    description: 'Replaces Helium identifier with standard Google Chrome brand string in Sec-CH-UA and navigator.userAgent to prevent anti-competitive breakage.',
    flagSwitch: '--spoof-chrome-ua-brand',
    category: 'Helium Features',
    state: 'enabled',
    defaultState: 'enabled'
  },
  {
    id: 'fluent-scrollbar',
    name: 'Modern Fluent Slim Scrollbars',
    description: 'Replaces bulky native OS scrollbars with modern auto-expanding slim pill scrollbars.',
    flagSwitch: '--enable-fluent-scrollbar',
    category: 'UI & Behavior',
    state: 'enabled',
    defaultState: 'enabled'
  }
];
