import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link href="/" className="footer-link">Home</Link>
          <Link href="/how-it-works" className="footer-link">How It Works</Link>
          <Link href="/faq" className="footer-link">FAQ</Link>
          <a
            href="https://github.com/kamalstores/MetaScrub"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub ↗
          </a>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} MetaScrub · Built for privacy · No uploads ever
        </p>
      </div>
    </footer>
  );
}
