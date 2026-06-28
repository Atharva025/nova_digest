import { useState, useEffect, useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import News_Card from './News_Card';
import { UserContext } from './userContext';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  const { user } = useContext(UserContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');

  const fetchBookmarks = async () => {
    setLoading(true);
    if (user) {
      try {
        const res = await fetch(`/api/bookmarks/${user}`);
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data.bookmarks || []);
        }
      } catch { /* offline */ }
    } else {
      setBookmarks(JSON.parse(localStorage.getItem('guest_bookmarks') || '[]'));
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookmarks(); }, [user]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1 }}>
        {/* Page header */}
        <div style={{
          padding: '56px 24px 36px',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-default)',
          background: 'radial-gradient(ellipse at 50% -20%, rgba(99, 102, 241, 0.15) 0%, transparent 65%)',
        }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: '50%',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--accent-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Bookmark size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 800,
            fontFamily: 'Lora, Georgia, serif',
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)', margin: '0 0 6px',
          }}>
            Saved Articles
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500, fontFamily: 'Plus Jakarta Sans' }}>
            {loading ? '…' : `${bookmarks.length} article${bookmarks.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {/* Category folder filter */}
        {!loading && bookmarks.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '24px 20px 8px', flexWrap: 'wrap' }}>
            {['All', 'General', 'Research', 'To Read', 'Weekend'].map(tag => {
              const active = selectedTag === tag;
              const count = tag === 'All' 
                ? bookmarks.length 
                : bookmarks.filter(b => (b.tag || 'General') === tag).length;
              return (
                <button
                  key={tag}
                  className={`nd-chip ${active ? 'nd-chip-blue' : 'nd-chip-outline'}`}
                  onClick={() => setSelectedTag(tag)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {tag === 'All' ? '📁' : tag === 'Research' ? '📚' : tag === 'To Read' ? '⏱️' : tag === 'Weekend' ? '🏖️' : '📁'} {tag}
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="nd-spinner" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="nd-bookmarks-empty" style={{ border: '1px solid var(--border-default)', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '48px 24px', marginTop: 48 }}>
            <div className="nd-bookmarks-empty-icon" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-strong)', color: 'var(--accent)' }}>
              <Bookmark size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'Plus Jakarta Sans' }}>
              Nothing saved yet
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6, maxWidth: 320, margin: '0 auto 24px' }}>
              Hit the bookmark icon on any article card to save it here for reading later.
            </p>
            <Link to="/home" className="nd-btn nd-btn-primary">
              Explore Articles
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <News_Card 
            news={selectedTag === 'All' ? bookmarks : bookmarks.filter(b => (b.tag || 'General') === selectedTag)} 
            onBookmarkChange={setBookmarks} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Bookmarks;
