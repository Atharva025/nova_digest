import { useState, useEffect, useContext } from 'react';
import Header from './Header';
import { useLocation } from "react-router-dom";
import News_Card from './News_Card';
import { Search, X, TrendingUp, Clock, CloudSun, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Footer from './Footer';
import { UserContext } from './userContext';

const TRENDING = ['AI', 'Tech', 'Science', 'Gaming', 'Space', 'Business', 'Climate', 'Health'];

const Home_Page = () => {
  const [searchText, setSearchText] = useState('');
  const [news, setNews] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [searchHistory, setSearchHistory] = useState(() =>
    JSON.parse(localStorage.getItem('search_history') || '[]')
  );

  const { user } = useContext(UserContext);
  const location = useLocation();
  const { arr = [] } = location.state || {};

  useEffect(() => {
    if (arr.length > 0) {
      setGenres(arr);
      setSelectedGenre(arr[0]);
    } else if (user) {
      // Sync genres from MongoDB user profile
      fetch(`/api/user/profile/${user}`)
        .then(r => r.json())
        .then(data => {
          if (data.genre && data.genre.length > 0) {
            setGenres(data.genre);
          }
          // Determine the user's top read genre based on database history
          const history = data.readGenres || [];
          if (history.length > 0) {
            const sorted = [...history].sort((a, b) => b.count - a.count);
            setSelectedGenre(sorted[0].name);
          } else if (data.genre && data.genre.length > 0) {
            // Default fallback: First registered preferred genre
            setSelectedGenre(data.genre[0]);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (!selectedGenre && genres.length === 0) return;
    const q = selectedGenre || genres.join(' OR ');
    setLoading(true);
    fetch(`/api/news?q=${encodeURIComponent(q)}`)
      .then(r => {
        if (!r.ok) throw new Error("Aggregator failed");
        return r.json();
      })
      .then(d => {
        const mapped = (d.articles || []).map(art => ({
          ...art,
          genre: selectedGenre || 'General'
        }));
        setNews(mapped);
      })
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, [selectedGenre, genres]);

  const doSearch = (q) => {
    if (!q.trim()) return;
    const term = q.trim().toLowerCase();
    setSelectedGenre(term);
    setSearchText(term);
    const updated = [term, ...searchHistory.filter(h => h !== term)].slice(0, 6);
    setSearchHistory(updated);
    localStorage.setItem('search_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search_history');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header setSelectedGenre={(g) => doSearch(g)} />

      {/* Search hero */}
      <div style={{
        background: 'radial-gradient(ellipse at 50% -20%, var(--accent-subtle) 0%, transparent 65%)',
        padding: '64px 24px 48px',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-default)',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.75rem)',
          fontWeight: 800,
          fontFamily: 'Lora, Georgia, serif',
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          marginBottom: 8,
          lineHeight: 1.2
        }}>
          Stay informed, every day.
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 28, fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}>
          Search any topic or pick from your interests below.
        </p>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="nd-search-bar" style={{ maxWidth: 560 }}>
            <Search size={18} className="nd-search-icon" />
            <input
              id="search"
              className="nd-search-input"
              type="text"
              placeholder="Search for news topics…"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') doSearch(searchText); }}
            />
          </div>
          <button
            className="nd-btn nd-btn-primary"
            onClick={() => doSearch(searchText)}
          >
            Search
          </button>
        </div>

        {/* Trending chips */}
        <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <TrendingUp size={13} /> Trending:
          </span>
          {TRENDING.map(tag => (
            <button
              key={tag}
              className="nd-chip nd-chip-outline"
              onClick={() => doSearch(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Recent searches */}
        {searchHistory.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              <Clock size={13} /> Recent:
            </span>
            {searchHistory.map(h => (
              <button key={h} className="nd-chip nd-chip-blue" onClick={() => doSearch(h)}>
                {h}
              </button>
            ))}
            <button
              onClick={clearHistory}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.8125rem' }}
            >
              <X size={12} /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Feed Layout Grid */}
      <div className="nd-feed-layout">
        {/* Upper Deck Widgets Panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
          marginBottom: 28,
          width: '100%'
        }}>
          {/* Weather Widget */}
          <div className="nd-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderLeft: '3px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CloudSun size={20} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>Weather</h4>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>New York, NY</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Lora, serif' }}>72°F</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--success)', fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '4px' }}>Sunny</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              <span>Hum: 45%</span>
              <span>Wind: 8mph</span>
            </div>
          </div>

          {/* Market Index Widget */}
          <div className="nd-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderLeft: '3px solid var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingUp size={20} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <h4 style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>Markets</h4>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', overflowX: 'auto', flex: 1, justifyContent: 'flex-end' }}>
              {[
                { name: 'S&P 500', value: '5,432', diff: '+0.45%', up: true },
                { name: 'NASDAQ', value: '17,654', diff: '+0.82%', up: true },
                { name: 'Dow Jones', value: '39,120', diff: '-0.12%', up: false },
                { name: 'NIFTY 50', value: '23,501', diff: '+0.30%', up: true },
              ].map((idx, index) => (
                <div key={idx.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 70, borderRight: index === 3 ? 'none' : '1px solid var(--border-default)', paddingRight: index === 3 ? 0 : 12 }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: 'var(--text-muted)' }}>{idx.name}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{idx.value}</span>
                  <span style={{
                    fontSize: '0.6875rem', fontWeight: 600, color: idx.up ? 'var(--success)' : 'var(--danger)',
                    marginTop: 2, display: 'inline-flex', alignItems: 'center'
                  }}>
                    {idx.diff}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed Column */}
        <div style={{ minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
              <div className="nd-spinner" />
            </div>
          ) : news === null ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.0625rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}>Search for any topic above or select a genre from the Browse menu.</p>
            </div>
          ) : news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.0625rem', fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}>No articles found. Try a different search query.</p>
            </div>
          ) : (
            <News_Card news={news} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home_Page;
