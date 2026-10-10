import { PatchItem } from '../types/browser';

export const HELIUM_PATCHES: PatchItem[] = [
  {
    id: 'zen-mode',
    path: 'patches/helium/ui/layout/zen-mode.patch',
    vendor: 'Helium UI',
    category: 'Zen Mode & UI Layout',
    title: 'Helium Zen Mode Full Implementation',
    description: 'Implements immersive distraction-free Zen mode with smooth edge hover reveal (kZenModeRevealAnimationDuration = 200ms) and grace period.',
    targetFiles: [
      'chrome/browser/ui/views/frame/browser_view.cc',
      'chrome/browser/ui/views/frame/browser_view.h',
      'chrome/browser/ui/views/toolbar/toolbar_view.cc'
    ],
    diffExcerpt: `+constexpr int kZenModeRevealTriggerThickness = 6;
+constexpr int kZenModeChromeHoverLeeway = 8;
+constexpr base::TimeDelta kZenModeRevealAnimationDuration = base::Milliseconds(200);
+constexpr base::TimeDelta kZenModeCursorExitGracePeriod = base::Milliseconds(3000);
+
+void BrowserView::UpdateZenModeState() {
+  if (zen_mode_enabled_) {
+    top_container_->SetVisible(is_cursor_at_top_edge_);
+    frame_view_->SetCustomTitlebarRadius(14);
+  }
+}`,
    impact: 'Hides tabstrip and omnibox until mouse hover, expanding usable viewport area by ~80px.'
  },
  {
    id: 'vertical-tabs',
    path: 'patches/helium/ui/layout/vertical.patch',
    vendor: 'Helium UI',
    category: 'Zen Mode & UI Layout',
    title: 'Arc-Style Vertical Tabs Sidebar',
    description: 'Integrates vertical sidebar tabs with collapsible panel, pinned favicons grid, and smooth accordion animations.',
    targetFiles: [
      'chrome/browser/ui/views/tabs/tab_strip.cc',
      'chrome/browser/ui/views/tabs/vertical_tab_strip.cc',
      'chrome/browser/ui/views/tabs/vertical_tab_strip.h'
    ],
    diffExcerpt: `+class VerticalTabStrip : public views::View {
+ public:
+  void SetCollapsed(bool collapsed);
+  void LayoutPinnedTabsGrid();
+  void AnimateTabSwitch(int from_index, int to_index);
+};`,
    impact: 'Allows efficient management of 50+ tabs on widescreen monitors without shrinking tab widths.'
  },
  {
    id: 'canvas-noise',
    path: 'patches/helium/core/noise/canvas.patch',
    vendor: 'Helium Core',
    category: 'Fingerprinting & Noise',
    title: 'HTML5 Canvas Math Randomization Noise',
    description: 'Intercepts CanvasRenderingContext2D toDataURL and getImageData calls, applying deterministic session noise to defeat canvas fingerprinting.',
    targetFiles: [
      'third_party/blink/renderer/core/html/canvas/canvas_rendering_context_2d.cc',
      'chrome/browser/helium_flag_choices.h'
    ],
    diffExcerpt: `+void ApplyHeliumCanvasNoise(SkBitmap& bitmap, const std::string& origin) {
+  uint32_t session_seed = GetOriginNoiseSeed(origin);
+  for (int y = 0; y < bitmap.height(); y += 4) {
+    for (int x = 0; x < bitmap.width(); x += 4) {
+      SkColor c = bitmap.getColor(x, y);
+      uint8_t noise = (session_seed ^ (x * 31 + y * 17)) & 0x03;
+      bitmap.setColor(x, y, SkColorSetRGB(SkColorGetR(c) ^ noise, SkColorGetG(c), SkColorGetB(c)));
+    }
+  }
+}`,
    impact: 'Renders tracking hashes unique per domain and session, completely preventing cross-site behavioral tracking.'
  },
  {
    id: 'audio-noise',
    path: 'patches/helium/core/noise/audio.patch',
    vendor: 'Helium Core',
    category: 'Fingerprinting & Noise',
    title: 'WebAudio Acoustic Channel Noise Injection',
    description: 'Adds minor non-destructive perturbation to WebAudio AnalyserNode getFloatFrequencyData buffers to block audio fingerprinting.',
    targetFiles: [
      'third_party/blink/renderer/modules/webaudio/analyser_node.cc',
      'third_party/blink/renderer/modules/webaudio/audio_buffer.cc'
    ],
    diffExcerpt: `+void AnalyserHandler::GetFloatFrequencyData(DOMFloat32Array* array) {
+  GetFloatFrequencyDataInternal(array);
+  if (HeliumNoiseEnabled()) {
+    InjectAcousticJitter(array->Data(), array->length());
+  }
+}`,
    impact: 'Defeats audio fingerprinting test suites like FingerprintJS with zero impact on Spotify, YouTube, or music playback.'
  },
  {
    id: 'ublock-component',
    path: 'patches/helium/core/ublock-install-as-component.patch',
    vendor: 'Helium Core',
    category: 'Adblocking & uBlock',
    title: 'Integrated uBlock Origin Component',
    description: 'Embeds uBlock Origin directly into the browser component architecture, granting C++ level DNS uncloaking and lightning-fast request filtering.',
    targetFiles: [
      'chrome/browser/component_updater/ublock_component_installer.cc',
      'chrome/browser/component_updater/ublock_component_installer.h',
      'chrome/browser/extensions/component_loader.cc'
    ],
    diffExcerpt: `+void RegisterUBlockComponent(ComponentUpdateService* cus) {
+  base::MakeRefCounted<ComponentInstaller>(
+      std::make_unique<UBlockComponentInstallerPolicy>())->Register(cus);
+}`,
    impact: 'Zero setup required: pre-configured with EasyList, Peter Lowe, and Helium privacy rules on first launch.'
  },
  {
    id: 'native-bangs-patch',
    path: 'patches/helium/core/add-native-bangs.patch',
    vendor: 'Helium Core',
    category: 'Search & Bangs',
    title: 'Native Bangs Omnibox Parser',
    description: 'Parses bang syntax directly inside TemplateURLBangManager, bypassing DuckDuckGo redirect latency when using !g, !w, !k, or !yt.',
    targetFiles: [
      'chrome/browser/search_engines/template_url_service_factory.cc',
      'components/search_engines/template_url_bang_manager.cc',
      'components/search_engines/template_url_bang_manager.h'
    ],
    diffExcerpt: `+TemplateURLData TemplateURLDataFromBang(const Bangs::Bang& bang) {
+  TemplateURLData data;
+  data.SetShortName(base::UTF8ToUTF16(bang.name));
+  data.SetKeyword(base::UTF8ToUTF16(bang.prefix));
+  data.SetURL(bang.url_pattern);
+  return data;
+}`,
    impact: 'Saves 150-300ms on every bang query compared to web-redirect based bang systems.'
  },
  {
    id: 'split-clienthello-patch',
    path: 'patches/helium/core/network/split-clienthello.patch',
    vendor: 'Helium Core',
    category: 'Network & Security',
    title: 'TCP Segmentation for TLS ClientHello',
    description: 'Splits TLS ClientHello across two TCP segments to evade deep packet inspection (DPI) SNI filtering in censored regions.',
    targetFiles: [
      'net/socket/ssl_client_socket_impl.cc',
      'net/base/features.cc'
    ],
    diffExcerpt: `+if (base::FeatureList::IsEnabled(features::kSplitClientHello)) {
+  size_t split_offset = client_hello.length() / 2;
+  transport_->Write(client_hello.data(), split_offset);
+  transport_->Write(client_hello.data() + split_offset, client_hello.length() - split_offset);
+}`,
    impact: 'Protects user access to independent news and search engines in high-censorship environments.'
  },
  {
    id: 'degoogle-patch',
    path: 'patches/ungoogled-chromium/disable-google-host-detection.patch',
    vendor: 'Ungoogled Chromium',
    category: 'Privacy & De-googling',
    title: 'Disable Google Host Detection & Pingbacks',
    description: 'Strips hardcoded Google backend endpoints, telemetry pings, RLZ tracking, and Chrome sync telemetry.',
    targetFiles: [
      'chrome/browser/google/google_url_tracker.cc',
      'components/google/core/common/google_util.cc'
    ],
    diffExcerpt: `--- a/components/google/core/common/google_util.cc
+++ b/components/google/core/common/google_util.cc
@@ -102,7 +102,7 @@ bool IsGoogleDomainUrl(const GURL& url, SubdomainPermission subdomain_permission,
-  return IsGoogleDomainUrlImpl(url, subdomain_permission, search_subdomain_permission);
+  return false;`,
    impact: 'Zero unprompted outbound connections to Google servers.'
  },
  {
    id: 'memory-saver-patch',
    path: 'patches/helium/core/memory-saving-by-default.patch',
    vendor: 'Helium Core',
    category: 'Performance',
    title: 'Proactive Memory Saver & Tab Discarding',
    description: 'Enables high-efficiency memory saver by default, reclaiming RAM from inactive tabs with seamless instant revival.',
    targetFiles: [
      'chrome/browser/performance_manager/user_tuning/user_performance_tuning_manager.cc',
      'components/performance_manager/public/features.h'
    ],
    diffExcerpt: `+pref_service->SetDefaultPrefValue(
+    performance_manager::user_tuning::prefs::kMemorySaverModeState,
+    base::Value(static_cast<int>(MemorySaverModeState::kEnabled)));`,
    impact: 'Reduces Helium background RAM footprint by up to 50% compared to vanilla Chromium.'
  },
  {
    id: 'vault-sync-patch',
    path: 'patches/helium/core/sync/vault-encryption.patch',
    vendor: 'Helium Core',
    category: 'Privacy & De-googling',
    title: 'Local Encrypted Helium Vault Sync',
    description: 'Replaces proprietary Google sync engine with an end-to-end encrypted local vault using Argon2id and AES-256-GCM.',
    targetFiles: [
      'chrome/browser/sync/helium_vault/vault_crypto.cc',
      'chrome/browser/sync/helium_vault/vault_crypto.h'
    ],
    diffExcerpt: `+bool EncryptVaultPayload(const std::string& plaintext, const std::string& passphrase, std::string* ciphertext) {
+  uint8_t salt[16];
+  crypto::RandBytes(salt, sizeof(salt));
+  uint8_t key[32];
+  Argon2id_DeriveKey(passphrase, salt, key);
+  return Aes256Gcm_Encrypt(key, plaintext, ciphertext);
+}`,
    impact: 'Bookmarks, settings, and shortcuts sync privately without any corporate cloud accounts.'
  }
];
