'use client';

import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    q: 'Does MetaScrub upload my files to any server?',
    a: 'Absolutely not. Every single operation — reading the file, parsing metadata, stripping it, and generating the output — happens entirely inside your browser tab using JavaScript and WebAssembly. Your files never touch the internet.',
  },
  {
    q: 'What file types are supported?',
    a: 'MetaScrub currently supports images (JPEG, PNG, HEIC, WebP, GIF, TIFF), videos (MP4, MOV, AVI, MKV), and PDF documents. Support for more formats is actively being added.',
  },
  {
    q: 'Can I process large video files without the tab crashing?',
    a: 'Yes. For large files, MetaScrub uses the Streams API to process data in small chunks rather than loading the entire file into memory at once. This means even multi-gigabyte videos can be processed without exhausting browser RAM.',
  },
  {
    q: 'What metadata does MetaScrub strip from images?',
    a: 'From images, MetaScrub can strip: GPS latitude and longitude, GPS altitude, date and time stamps, camera make and model, software version, author/artist name, copyright notices, user comments, and many more EXIF/IPTC/XMP tags. You can selectively keep any field you want.',
  },
  {
    q: 'What metadata does MetaScrub strip from videos?',
    a: 'For video files processed via ffmpeg.wasm, MetaScrub strips the entire metadata track including embedded GPS data, encoder strings, creation timestamps, and author atoms (moov/udta). The video and audio content are preserved perfectly.',
  },
  {
    q: 'Does stripping metadata degrade image or video quality?',
    a: 'For JPEG images, the canvas re-export uses 95% quality — visually lossless to the human eye. For PNG and WebP, the format is lossless by nature. For videos, MetaScrub uses the -c copy flag in ffmpeg, meaning the video and audio streams are bit-for-bit identical, just the metadata container is removed — zero quality loss.',
  },
  {
    q: 'Is MetaScrub open source?',
    a: 'Yes! The full source code is publicly available on GitHub at github.com/kamalstores. You can inspect exactly what the code does, fork it, or contribute to it.',
  },
  {
    q: 'Can I use MetaScrub offline?',
    a: 'Yes. MetaScrub is built as a Progressive Web App (PWA). Once loaded, you can install it to your device via your browser\'s "Install App" option and use it completely offline.',
  },
  {
    q: 'Are cleaned files stored anywhere after download?',
    a: 'No. Once your ZIP file is downloaded, all processed data is immediately garbage-collected by the browser. When you close the tab, nothing persists — no cache, no local storage, no file system writes.',
  },
  {
    q: 'Why does MetaScrub need the Cross-Origin-Embedder-Policy header?',
    a: 'The COEP and COOP headers are required by browsers to enable SharedArrayBuffer, which ffmpeg.wasm needs for multi-threaded WebAssembly execution. This is a browser security requirement, not something we added — it actually makes the app more isolated and secure.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'There is no hard-coded limit. The practical limit is your browser\'s available RAM. On modern devices, files up to several gigabytes work fine due to the Streams API chunking. For very large batches, processing files in groups of 5-10 is recommended.',
  },
  {
    q: 'Does this work on mobile?',
    a: 'Yes. MetaScrub is fully responsive and works on iOS Safari and Chrome for Android. Note that video processing via ffmpeg.wasm may be slower on mobile devices due to CPU constraints, but it is fully functional.',
  },
];

const categories = ['All Questions', 'Privacy', 'Technical', 'File Support', 'Usage'];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      {/* Header */}
      <section className="page-header container">
        <div className="section-badge" style={{ margin: '0 auto 16px' }}>❓ FAQ</div>
        <h1 className="section-title" style={{ textAlign: 'center' }}>
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="section-subtitle" style={{ textAlign: 'center', margin: '16px auto 0' }}>
          Everything you need to know about how MetaScrub keeps your files private.
        </p>
      </section>

      {/* FAQ List */}
      <section className="section container">
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              id={`faq-${i}`}
              className={`faq-item${open === i ? ' open' : ''}`}
            >
              <div
                className="faq-question"
                onClick={() => setOpen(open === i ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="faq-q-text">{faq.q}</span>
                <span className="faq-chevron" aria-hidden="true">⌄</span>
              </div>
              <div
                id={`faq-answer-${i}`}
                className="faq-answer"
                role="region"
              >
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <div className="glass-card" style={{
            padding: '40px',
            maxWidth: '560px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{ fontSize: '36px' }} aria-hidden="true">💬</div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>
              Still have questions?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, textAlign: 'center' }}>
              Open an issue on GitHub or read through the source code — the implementation is transparent by design.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://github.com/kamalstores"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-github"
                id="faq-github-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                Open GitHub Issue
              </a>
              <Link href="/#tool" className="btn-primary" id="faq-try-btn">
                Try MetaScrub →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
