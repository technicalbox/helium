export interface LanguageInfo {
  code: string;
  name: string;
  sampleStrings?: {
    memorySaver: string;
    batterySaver: string;
    fingerprintingProtection: string;
  };
}

export const LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English (US)',
    sampleStrings: {
      memorySaver: 'Helium frees up memory from inactive tabs. This gives active tabs and other apps more computer resources and keeps Helium fast.',
      batterySaver: 'Helium conserves battery power by limiting background activity and visual effects.',
      fingerprintingProtection: 'When fingerprinting protection is enabled, Helium adds noise to certain browser features to make it harder for sites to track you.'
    }
  },
  {
    code: 'es',
    name: 'Spanish (Español)',
    sampleStrings: {
      memorySaver: 'Helium libera memoria de las pestañas inactivas. Esto proporciona más recursos informáticos a las pestañas activas y a otras aplicaciones.',
      batterySaver: 'Helium ahorra batería limitando la actividad en segundo plano y los efectos visuales.',
      fingerprintingProtection: 'Cuando la protección contra huellas digitales está activada, Helium añade ruido a ciertas funciones del navegador.'
    }
  },
  {
    code: 'fr',
    name: 'French (Français)',
    sampleStrings: {
      memorySaver: 'Helium libère de la mémoire des onglets inactifs afin de rendre Helium plus rapide.',
      batterySaver: 'Helium préserve l’autonomie de la batterie en limitant l’activité en arrière-plan.',
      fingerprintingProtection: 'Helium protège votre vie privée en ajoutant du bruit numérique contre le pistage.'
    }
  },
  {
    code: 'de',
    name: 'German (Deutsch)',
    sampleStrings: {
      memorySaver: 'Helium gibt Arbeitsspeicher von inaktiven Tabs frei, damit aktiver Content flüssig bleibt.',
      batterySaver: 'Helium schont den Akku durch Drosselung von Hintergrundprozessen.',
      fingerprintingProtection: 'Helium fügt ausgewählten Schnittstellen Zufallsrauschen hinzu, um Browser-Fingerprinting zu verhindern.'
    }
  },
  {
    code: 'ja',
    name: 'Japanese (日本語)',
    sampleStrings: {
      memorySaver: 'Helium は非アクティブなタブのメモリを解放し、ブラウザの高速動作を維持します。',
      batterySaver: 'Helium はバックグラウンドの処理や視覚効果を抑制してバッテリーを節約します。',
      fingerprintingProtection: 'フィンガープリント保護を有効にすると、サイトによる追跡を防止するノイズが付加されます。'
    }
  },
  {
    code: 'zh-CN',
    name: 'Chinese Simplified (简体中文)',
    sampleStrings: {
      memorySaver: 'Helium 会释放非活动标签页占用的内存，确保活跃应用顺畅运行。',
      batterySaver: 'Helium 通过限制后台活动和动画特效来节省电量。',
      fingerprintingProtection: '开启防指纹追踪后，Helium 会对 Canvas 与音频 API 注入微扰噪声。'
    }
  },
  {
    code: 'ru',
    name: 'Russian (Русский)',
    sampleStrings: {
      memorySaver: 'Helium освобождает оперативную память неактивных вкладок.',
      batterySaver: 'Helium экономит заряд аккумулятора, ограничивая фоновую активность.',
      fingerprintingProtection: 'Helium добавляет шум в сигнатуры браузера для защиты от цифрового отпечатка.'
    }
  },
  {
    code: 'pt-BR',
    name: 'Portuguese (Português)',
    sampleStrings: {
      memorySaver: 'O Helium libera memória das guias inativas para manter a navegação rápida.',
      batterySaver: 'O Helium economiza bateria limitando atividades em segundo plano.',
      fingerprintingProtection: 'Proteção contra fingerprinting adiciona ruído em APIs para evitar rastreamento.'
    }
  },
  {
    code: 'it',
    name: 'Italian (Italiano)',
    sampleStrings: {
      memorySaver: 'Helium libera memoria dalle schede inattive per mantenere il browser scattante.',
      batterySaver: 'Helium risparmia la batteria riducendo le animazioni in background.',
      fingerprintingProtection: 'La protezione dall’impronta digitale aggiunge disturbo ai sensori web.'
    }
  },
  {
    code: 'uk',
    name: 'Ukrainian (Українська)',
    sampleStrings: {
      memorySaver: 'Helium звільняє памʼять неактивних вкладок для підвищення швидкодії.',
      batterySaver: 'Helium заощаджує заряд акумулятора, обмежуючи фонові процеси.',
      fingerprintingProtection: 'Helium захищає від цифрового відбитка додаванням шуму в Canvas та аудіо.'
    }
  }
];
