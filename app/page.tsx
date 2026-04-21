import Link from 'next/link';
import MetaCleanerTool from '@/components/MetaCleanerTool';

const features = [
  {
    color: 'violet',
    icon: '🔒',
    title: 'Zero-Upload Privacy',
    desc: 'Your files never leave your device. All processing happens locally in your browser using WebAssembly — no server, no cloud, no exposure.',
  },
  {
    color: 'cyan',
    icon: '⚡',
    title: 'WASM-Powered Speed',
    desc: 'ffmpeg.wasm brings native C/C++ processing speed directly into your browser for video files. Images use the Canvas API for lightning-fast EXIF stripping.',
  },
  {
    color: 'green',
    icon: '🎛️',
    title: 'Selective Metadata Control',
    desc: 'See exactly what hidden data exists in each file. Toggle off sensitive fields (GPS, author) while preserving harmless ones (resolution, color profile).',
  },
  {
    color: 'rose',
    icon: '🔄',
    title: 'Batch Processing + ZIP',
    desc: 'Drop multiple files at once. All cleaned files are bundled into a single ZIP download — no clunky one-file-at-a-time workflow.',
  },
  {
    color: 'violet',
    icon: '🧵',
    title: 'Non-Blocking UI',
    desc: 'Heavy parsing and rewriting tasks run in the background, keeping the interface smooth and responsive even during intense batch operations.',
  },
  {
    color: 'cyan',
    icon: '📱',
    title: 'Offline-Ready PWA',
    desc: 'Install MetaScrub directly to your device. Run full metadata scrubbing sessions without any internet connection — complete offline capability.',
  },
];

const stats = [
  { value: '0', label: 'Bytes uploaded', desc: 'Files never leave your device' },
  { value: '100%', label: 'Client-side', desc: 'All processing in browser' },
  { value: '8+', label: 'File formats', desc: 'Images, video, PDF' },
  { value: '∞', label: 'Files at once', desc: 'Unlimited batch processing' },
];

export default function Home() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="hero container">
        <div className="badge animate-in">
          <span className="badge-dot" aria-hidden="true" />
          Privacy-First · 100% Client-Side · Open Source
        </div>

        <h1 className="hero-title animate-in animate-in-delay-1">
          Strip Hidden Metadata<br />
          <span className="gradient-text">Without Uploading a Thing</span>
        </h1>

        <p className="hero-subtitle animate-in animate-in-delay-2">
          Every photo and video you take silently embeds GPS coordinates, device info, and timestamps.
          MetaScrub removes all of it — right in your browser — guaranteed.
        </p>

        <div className="hero-actions animate-in animate-in-delay-3">
          <a href="#tool" className="btn-primary" id="hero-cta-btn">
            🧹 Clean My Files — It&apos;s Free
          </a>
          <Link href="/how-it-works" className="btn-secondary">
            How It Works →
          </Link>
        </div>

        <div className="hero-trust animate-in animate-in-delay-4">
          <span className="trust-item"><span className="trust-icon">🔒</span>No uploads ever</span>
          <span className="trust-item"><span className="trust-icon">⚡</span>WebAssembly powered</span>
          <span className="trust-item"><span className="trust-icon">🌐</span>Works offline</span>
          <span className="trust-item"><span className="trust-icon">📖</span>Open source</span>
        </div>
      </section>

      {/* ─── Tool Section ─── */}
      <section className="tool-section container" id="tool">
        <MetaCleanerTool />
      </section>

      {/* ─── Stats ─── */}
      <section className="container" style={{ padding: '40px 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}>
          {stats.map((s) => (
            <div key={s.label} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '2rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '4px',
              }}>{s.value}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="section container" id="features">
        <div>
          <div className="section-badge">✨ Features</div>
          <h2 className="section-title">Everything you need.<br />Nothing you don&apos;t.</h2>
          <p className="section-subtitle">Built for privacy advocates, journalists, researchers, and anyone who values digital safety.</p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className={`feature-card ${f.color}`}>
              <div className={`feature-icon ${f.color}`} aria-hidden="true">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Threat Awareness ─── */}
      <section className="section container" id="threat">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-badge">⚠️ The Hidden Risk</div>
          <h2 className="section-title">What&apos;s hiding in your files?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Every file you share can contain a silent profile about you.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { icon: '📍', title: 'GPS Coordinates', desc: 'Exact latitude and longitude where a photo was taken — your home, workplace, or a sensitive location.', color: '#f43f5e' },
            { icon: '📷', title: 'Device Fingerprint', desc: 'Camera model, serial number hints, and firmware versions that uniquely identify your device.', color: '#fb923c' },
            { icon: '🕒', title: 'Timestamps', desc: 'Precise date and time a photo was taken, modified, or even digitized — down to the second.', color: '#a855f7' },
            { icon: '👤', title: 'Personal Data', desc: 'Author names, copyright strings, and software used — data you embed without knowing it.', color: '#06b6d4' },
          ].map(t => (
            <div key={t.title} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }} aria-hidden="true">{t.icon}</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: '8px', color: t.color }}>{t.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="container">
        <div className="privacy-banner">
          <h2 className="privacy-banner-title">
            Your privacy is <span className="gradient-text">non-negotiable</span>
          </h2>
          <p className="privacy-banner-sub">
            Stop leaking your location, device, and identity every time you share a photo. Start cleaning your files in seconds — completely free.
          </p>
          <div className="privacy-banner-actions">
            <a href="#tool" className="btn-primary" id="cta-banner-btn">
              🧹 Clean Files Now
            </a>
            <a
              href="https://github.com/kamalstores/MetaScrub"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              id="cta-github-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View Source Code
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
