import { BangItem } from '../types/browser';

export const BANGS_LIST: BangItem[] = [
  { prefix: '!g', name: 'Google Search', url: 'https://www.google.com/search?q={q}', category: 'Search', description: 'Search Google directly' },
  { prefix: '!ddg', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q={q}', category: 'Search', description: 'Search DuckDuckGo' },
  { prefix: '!b', name: 'Brave Search', url: 'https://search.brave.com/search?q={q}', category: 'Search', description: 'Search Brave Search' },
  { prefix: '!k', name: 'Kagi Search', url: 'https://kagi.com/search?q={q}', category: 'Search', description: 'Search with Kagi' },
  { prefix: '!sp', name: 'Startpage', url: 'https://www.startpage.com/sp/search?query={q}', category: 'Search', description: 'Search Startpage anonymously' },
  { prefix: '!w', name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Special:Search?search={q}', category: 'Knowledge', description: 'Search English Wikipedia' },
  { prefix: '!gh', name: 'GitHub', url: 'https://github.com/search?q={q}', category: 'Development', description: 'Search repositories and code on GitHub' },
  { prefix: '!r', name: 'Reddit', url: 'https://www.reddit.com/search/?q={q}', category: 'Social', description: 'Search Reddit discussions' },
  { prefix: '!yt', name: 'YouTube', url: 'https://www.youtube.com/results?search_query={q}', category: 'Media', description: 'Search YouTube videos' },
  { prefix: '!hn', name: 'Hacker News', url: 'https://hn.algolia.com/?q={q}', category: 'Social', description: 'Search Hacker News submissions and comments' },
  { prefix: '!so', name: 'Stack Overflow', url: 'https://stackoverflow.com/search?q={q}', category: 'Development', description: 'Search programming Q&A on Stack Overflow' },
  { prefix: '!mdn', name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/search?q={q}', category: 'Development', description: 'Search Web APIs and HTML/CSS/JS references' },
  { prefix: '!aw', name: 'ArchWiki', url: 'https://wiki.archlinux.org/index.php?search={q}', category: 'Knowledge', description: 'Search Arch Linux Wiki documentation' },
  { prefix: '!m', name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/search?query={q}', category: 'Search', description: 'Search OpenStreetMap locations' },
  { prefix: '!a', name: 'Amazon', url: 'https://www.amazon.com/s?k={q}', category: 'Search', description: 'Search products on Amazon' }
];

export function resolveBangQuery(query: string): { isBang: boolean; bang?: BangItem; targetUrl?: string; cleanQuery?: string } {
  const trimmed = query.trim();
  const match = trimmed.match(/^(![a-zA-Z0-9]+)\s*(.*)$/);
  if (match) {
    const prefix = match[1].toLowerCase();
    const queryTerm = match[2].trim();
    const found = BANGS_LIST.find((b) => b.prefix.toLowerCase() === prefix);
    if (found) {
      const targetUrl = found.url.replace('{q}', encodeURIComponent(queryTerm));
      return { isBang: true, bang: found, targetUrl, cleanQuery: queryTerm };
    }
  }
  return { isBang: false };
}
