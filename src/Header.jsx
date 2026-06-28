import { useContext, useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "./userContext";
import { Newspaper, ChevronDown, Bookmark, Sun, Moon, LogOut, User, X, Check } from 'lucide-react';
import Genres from "../src/components/Genre_Types";

const GENRE_ICONS = {
  Politics: '🏛️',
  Sports:   '⚽',
  Movies:   '🎬',
  Finance:  '📈',
  International: '🌍',
  National: '🇮🇳',
};

const Header = ({ setSelectedGenre }) => {
  const { user, setUser } = useContext(UserContext);
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [breaking, setBreaking] = useState([]);
  const [showTicker, setShowTicker] = useState(true);
  const genreRef = useRef(null);
  const userRef  = useRef(null);
  const location = useLocation();

  useEffect(() => {
    fetch('/api/news?q=breaking')
      .then(r => r.json())
      .then(d => {
        if (d.articles) {
          setBreaking(d.articles.slice(0, 5).map(a => a.title));
        }
      })
      .catch(() => {});
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (genreRef.current && !genreRef.current.contains(e.target)) setShowGenreMenu(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.body.classList.add(next);
    document.body.classList.remove(theme);
  };

  const handleLogout = () => {
    setUser(null);
    setShowUserMenu(false);
  };

  const handleGenreSelect = (name) => {
    if (setSelectedGenre) setSelectedGenre(name);
    setShowGenreMenu(false);
  };

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      {showTicker && breaking.length > 0 && (
        <div style={{
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-default)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
            <span style={{
              background: '#991b1b',
              color: '#fff',
              padding: '3px 8px',
              borderRadius: '2px',
              fontSize: '0.625rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>Breaking</span>
            <marquee scrollamount="3.5" style={{ margin: 0, padding: 0, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {breaking.join('   •   ')}
            </marquee>
          </div>
          <button 
            onClick={() => setShowTicker(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              marginLeft: 12,
              opacity: 0.8
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}
      <nav className="nd-navbar" style={{ position: 'static' }}>
        <div className="nd-navbar-inner">

          <Link to="/home" className="nd-logo" style={{ gap: 6 }}>
          <Newspaper size={18} style={{ color: 'var(--accent)' }} />
          <span className="nd-logo-text">NovaDigest</span>
        </Link>

        {/* Center nav links */}
        <div className="nd-nav-links">
          <Link
            to="/home"
            className={`nd-nav-link ${location.pathname === '/home' ? 'active' : ''}`}
          >
            Feed
          </Link>

          {/* Genre dropdown */}
          <div style={{ position: 'relative' }} ref={genreRef}>
            <button
              className="nd-nav-link"
              onClick={() => setShowGenreMenu(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              Browse
              <ChevronDown
                size={14}
                style={{
                  transition: 'transform 0.2s',
                  transform: showGenreMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>
            {showGenreMenu && (
              <div className="nd-genre-menu">
                {Genres.map((g) => (
                  <button
                    key={g.name}
                    className="nd-genre-item"
                    onClick={() => handleGenreSelect(g.name)}
                  >
                    <span>{GENRE_ICONS[g.name] || '📰'}</span>
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/bookmarks"
            className={`nd-nav-link ${location.pathname === '/bookmarks' ? 'active' : ''}`}
          >
            <Bookmark size={14} />
            Saved
          </Link>
        </div>

        {/* Right actions */}
        <div className="nd-nav-actions">
          {/* Theme toggle */}
          <button
            className="nd-icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark'
              ? <Sun size={16} style={{ color: '#fbbf24' }} />
              : <Moon size={16} />
            }
          </button>

          {/* User menu */}
          {user ? (
            <div style={{ position: 'relative' }} ref={userRef}>
              <button
                className="nd-icon-btn"
                onClick={() => setShowUserMenu(v => !v)}
                title={user}
                style={{
                  width: 'auto',
                  padding: '0 12px',
                  gap: 6,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                <div style={{
                  width: 24, height: 24,
                  borderRadius: '50%',
                  background: 'var(--accent-subtle)',
                  border: '1px solid var(--accent-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)',
                }}>
                  {user[0].toUpperCase()}
                </div>
                {user}
                <ChevronDown size={12} />
              </button>
              {showUserMenu && (
                <div
                  className="nd-genre-menu"
                  style={{ right: 0, left: 'auto', transform: 'none', minWidth: 160 }}
                >
                  <div style={{
                    padding: '8px 12px 12px',
                    borderBottom: '1px solid var(--border-default)',
                    marginBottom: 4,
                  }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {user}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Signed in</p>
                  </div>
                  <Link to="/dashboard" className="nd-genre-item" onClick={() => setShowUserMenu(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
                    <User size={14} />
                    My Dashboard
                  </Link>
                  <button className="nd-genre-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                    <LogOut size={14} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nd-btn nd-btn-primary nd-btn-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  </div>
);
};

Header.propTypes = {
  setSelectedGenre: PropTypes.func,
};

export default Header;