import { Link } from "react-router-dom";
import { Newspaper } from 'lucide-react';
import Genres from "../src/components/Genre_Types";

const GENRE_ICONS = {
  Politics: '🏛️', Sports: '⚽', Movies: '🎬',
  Finance: '📈', International: '🌍', National: '🇮🇳',
};

const Footer = () => (
  <footer className="nd-footer">
    <div className="nd-footer-inner">
      {/* Brand */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: '1.125rem',
          marginBottom: 6,
        }}>
          <Newspaper size={16} style={{ color: 'var(--accent)' }} />
          <span className="nd-logo-text">NovaDigest</span>
        </div>
        <p className="nd-footer-copy" style={{ maxWidth: 260, lineHeight: 1.6 }}>
          A curated news reader. We pull real-time articles from across the web — no content stored on our servers.
        </p>
      </div>

      {/* Genres */}
      <div>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Topics
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Genres.map(g => (
            <span key={g.name} className="nd-footer-copy" style={{ fontSize: '0.8125rem' }}>
              {GENRE_ICONS[g.name]} {g.name}
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Pages
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link to="/home" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none' }} className="nd-footer-link">Feed</Link>
          <Link to="/bookmarks" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Saved</Link>
          <Link to="/about_us" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none' }}>About</Link>
        </div>
      </div>
    </div>

    <div style={{
      maxWidth: 1280, margin: '32px auto 0',
      paddingTop: 24, borderTop: '1px solid var(--border-default)',
      textAlign: 'center',
    }}>
      <p className="nd-footer-copy">
        © {new Date().getFullYear()} NovaDigest · Built by Akberali, Saachi & Atharva
      </p>
    </div>
  </footer>
);

export default Footer;
