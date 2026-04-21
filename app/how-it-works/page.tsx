import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works — MetaScrub',
  description: 'Learn how MetaScrub uses WebAssembly, Canvas API, and Web Workers to strip metadata from your files entirely in the browser without uploading anything.',
};

const steps = [
  {
    num: '01',
    icon: '📂',
    title: 'Drop Your Files',
    desc: 'Drag and drop any image (JPEG, PNG, HEIC, WebP), video (MP4, MOV, AVI), or PDF into the secure drop zone. You can add multiple files at once for batch processing.',
    detail: 'Files are loaded into your browser\'s local memory using the File API — never transmitted over a network.',
  },
  {
    num: '02',
    icon: '🔍',
    title: 'Instant Metadata Analysis',
    desc: 'MetaScrub immediately parses each file\'s headers and binary structure to extract all embedded metadata fields — GPS coordinates, device info, timestamps, author data, and more.',
    detail: 'Uses ExifReader.js for images and ffmpeg.wasm metadata scanning for video files. All parsing runs in a Web Worker so the UI stays smooth.',
  },
  {
    num: '03',
    icon: '🎛️',
    title: 'You Decide What to Strip',
    desc: 'See every metadata field with its sensitivity rating (High / Medium / Low). High-risk fields like GPS and author info are pre-selected for removal. Toggle any field individually.',
    detail: 'You choose what to keep. Resolution, color profile, and other harmless fields can be preserved while dangerous ones are eliminated.',
  },
  {
    num: '04',
    icon: '⚡',
    title: 'In-Browser Processing',
    desc: 'For images: the Canvas API redraws the image pixel-by-pixel, producing a new file with zero EXIF data. For videos: ffmpeg.wasm (compiled C/C++) strips the metadata atoms natively in the browser.',
    detail: 'Large files use the Streams API to process in chunks, preventing memory crashes. The UI stays fully interactive throughout.',
  },
  {
    num: '05',
    icon: '📦',
    title: 'Download Your Clean ZIP',
    desc: 'All cleaned files are bundled into a single ZIP archive using JSZip, then immediately downloaded. No copies are stored anywhere — not even temporarily.',
    detail: 'Once you close the tab, everything is gone. No footprint, no cache, no history.',
  },
];

const techItems = [
  {
    label: 'Framework',
    name: 'Next.js App Router',
    desc: 'Server-side rendering with React and TypeScript for a fast, modern UI.',
    icon: '▲',
  },
  {
    label: 'Video Processing',
    name: 'ffmpeg.wasm',
    desc: 'FFmpeg compiled to WebAssembly. Native C/C++ speed inside the browser — no server needed.',
    icon: '🎬',
  },
  {
    label: 'Image Stripping',
    name: 'Canvas API',
    desc: 'Re-renders images through an HTML5 canvas, dropping all binary EXIF headers from the output.',
    icon: '🎨',
  },
  {
    label: 'EXIF Parsing',
    name: 'ExifReader.js',
    desc: 'Reads EXIF, IPTC, XMP, and GPS tags from image buffers entirely in the browser.',
    icon: '🔍',
  },
  {
    label: 'Concurrency',
    name: 'Web Workers',
    desc: 'Computation-heavy tasks run off the main thread, keeping the interface responsive at all times.',
    icon: '🧵',
  },
  {
    label: 'Memory Management',
    name: 'Streams API',
    desc: 'Files are processed in small chunks rather than loaded entirely into RAM — preventing tab crashes on huge files.',
    icon: '🌊',
  },
  {
    label: 'Bundling',
    name: 'JSZip',
    desc: 'Packages all cleaned files into a single download in-browser without any server involvement.',
    icon: '📦',
  },
  {
    label: 'Offline Support',
    name: 'Progressive Web App',
    desc: 'Configurable as a PWA so users can install it and run full sessions without internet.',
    icon: '📱',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Header */}
      <section className="page-header container">
        <div className="section-badge" style={{ margin: '0 auto 16px' }}>🔬 Technical Deep-Dive</div>
        <h1 className="section-title" style={{ textAlign: 'center' }}>
          How MetaScrub <span className="gradient-text">Actually Works</span>
        </h1>
        <p className="section-subtitle" style={{ textAlign: 'center', margin: '16px auto 0' }}>
          A zero-server, fully client-side privacy pipeline — built on WebAssembly, Web Workers, and the Streams API.
        </p>
      </section>

      {/* Process Steps */}
      <section className="section container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="glass-card"
              style={{ padding: '32px', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '24px', alignItems: 'start' }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  marginBottom: 8,
                }} aria-hidden="true">{step.icon}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                  STEP {step.num}
                </div>
              </div>
              <div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>
                  {step.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '12px' }}>
                  {step.desc}
                </p>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'rgba(6,182,212,0.06)',
                  border: '1px solid rgba(6,182,212,0.15)',
                  fontSize: '0.82rem',
                  color: 'var(--cyan)',
                  lineHeight: 1.6,
                }}>
                  💡 {step.detail}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div aria-hidden="true" style={{
                  gridColumn: '1',
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--border)',
                  fontSize: 20,
                }}>
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section container" id="tech-stack">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-badge" style={{ margin: '0 auto 16px' }}>⚙️ Technology Stack</div>
          <h2 className="section-title">Built on cutting-edge web tech</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>No servers. No backends. Just the modern web platform — pushed to its limits.</p>
        </div>
        <div className="tech-grid">
          {techItems.map((t) => (
            <div key={t.name} className="tech-card">
              <div style={{ fontSize: '24px', marginBottom: '10px' }} aria-hidden="true">{t.icon}</div>
              <div className="tech-label">{t.label}</div>
              <div className="tech-name">{t.name}</div>
              <div className="tech-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Model */}
      <section className="section container">
        <div className="privacy-banner">
          <h2 className="privacy-banner-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
            The security model is <span className="gradient-text">simple</span>
          </h2>
          <p className="privacy-banner-sub">
            No data ever leaves your browser tab. There is no API server to compromise, no database to breach, no account to hack. The attack surface is zero.
          </p>
          <div className="privacy-banner-actions">
            <Link href="/#tool" className="btn-primary" id="hiw-cta-btn">Try It Now →</Link>
            <Link href="/faq" className="btn-secondary" id="hiw-faq-btn">Read FAQ</Link>
          </div>
        </div>
      </section>
    </>
  );
}
