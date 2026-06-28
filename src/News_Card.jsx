import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Bookmark, BookmarkCheck, Clock } from 'lucide-react';
import { UserContext } from './userContext';
import PropTypes from 'prop-types';

const estimateReadTime = (text) => {
  if (!text) return '1 min';
  const words = text.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const SkeletonCard = () => (
  <div className="nd-card nd-news-card" style={{ pointerEvents: 'none' }}>
    <div className="nd-skeleton" style={{ height: 180, borderRadius: 0 }} />
    <div className="nd-news-card-body" style={{ gap: 10 }}>
      <div className="nd-skeleton" style={{ height: 12, width: '40%' }} />
      <div className="nd-skeleton" style={{ height: 16, width: '90%' }} />
      <div className="nd-skeleton" style={{ height: 16, width: '75%' }} />
      <div className="nd-skeleton" style={{ height: 13, width: '60%' }} />
    </div>
  </div>
);

const News_Card = ({ news, onBookmarkChange }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const isBookmarksPage = location.pathname === '/bookmarks';
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS = 20;
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);

  const handleTagChange = async (url, newTag) => {
    if (user) {
      try {
        const res = await fetch('/bookmarks/tag', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, url, tag: newTag }),
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data.bookmarks || []);
          if (onBookmarkChange) onBookmarkChange(data.bookmarks || []);
        }
      } catch { /* error */ }
    } else {
      const g = JSON.parse(localStorage.getItem('guest_bookmarks') || '[]');
      const bMark = g.find(b => b.url === url);
      if (bMark) {
        bMark.tag = newTag;
        localStorage.setItem('guest_bookmarks', JSON.stringify(g));
        setBookmarks(g);
        if (onBookmarkChange) onBookmarkChange(g);
      }
    }
  };

  const fetchBookmarks = async () => {
    if (user) {
      try {
        const res = await fetch(`/bookmarks/${user}`);
        if (res.ok) {
          const data = await res.json();
          setBookmarks(data.bookmarks || []);
        }
      } catch { /* offline */ }
    } else {
      setBookmarks(JSON.parse(localStorage.getItem('guest_bookmarks') || '[]'));
    }
  };

  useEffect(() => {
    fetchBookmarks();
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, [user, news]);

  const isBookmarked = (url) => bookmarks.some(b => b.url === url);

  const toggleBookmark = async (e, article) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (isBookmarked(article.url)) {
      if (user) {
        await fetch('/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, url: article.url }),
        }).catch(() => {});
      }
      updated = bookmarks.filter(b => b.url !== article.url);
    } else {
      if (user) {
        await fetch('/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, article }),
        }).catch(() => {});
      }
      updated = [...bookmarks, article];
    }
    setBookmarks(updated);
    if (!user) localStorage.setItem('guest_bookmarks', JSON.stringify(updated));
    if (onBookmarkChange) onBookmarkChange(updated);
  };

  const start  = (currentPage - 1) * ITEMS;
  const paged  = (news || []).slice(start, start + ITEMS);
  const pages  = Math.ceil((news || []).length / ITEMS);

  return (
    <div>
      {/* Featured Card (rendered only on first page) */}
      {currentPage === 1 && !loading && paged.length > 0 && paged[0] && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 0' }}>
          <Link
            to={{
              pathname: `/news/${encodeURIComponent(paged[0].title)}/${encodeURIComponent(paged[0].author)}/${encodeURIComponent(paged[0].content)}/${encodeURIComponent(paged[0].url)}/${encodeURIComponent(paged[0].urlToImage)}`,
            }}
            state={paged[0]}
            className="nd-card nd-featured-card"
          >
            {/* Thumbnail */}
            <div className="nd-featured-card-img-wrapper">
              {paged[0].urlToImage ? (
                <img
                  src={paged[0].urlToImage}
                  alt={paged[0].title}
                  className="nd-featured-card-img"
                  onError={e => { e.target.src = ''; e.target.style.display = 'none'; }}
                />
              ) : (
                <div style={{
                  height: '100%', minHeight: 260, background: 'var(--bg-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontSize: '3rem',
                }}>📰</div>
              )}
              {/* Bookmark button */}
              <button
                className={`nd-news-card-bookmark ${isBookmarked(paged[0].url) ? 'active' : ''}`}
                onClick={(e) => toggleBookmark(e, paged[0])}
                title={isBookmarked(paged[0].url) ? 'Remove bookmark' : 'Save article'}
              >
                {isBookmarked(paged[0].url) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </button>
            </div>

            {/* Body */}
            <div className="nd-featured-card-body">
              <div className="nd-news-card-meta">
                <span className="nd-badge nd-badge-blue">Featured Story</span>
                <span className="nd-badge nd-badge-muted" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={10} />
                  {estimateReadTime(paged[0].content || paged[0].description)}
                </span>
              </div>
              <h2 className="nd-featured-card-title">{paged[0].title || 'No title'}</h2>
              <p className="nd-featured-card-desc">{paged[0].description || 'No description available.'}</p>
              {paged[0].author && (
                <p className="nd-news-card-author" style={{ margin: 0 }}>By {paged[0].author}</p>
              )}
              {isBookmarksPage && (
                <div 
                  onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                  style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Folder:</span>
                  <select
                    value={paged[0].tag || 'General'}
                    onChange={(e) => handleTagChange(paged[0].url, e.target.value)}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      color: 'var(--text-primary)',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option value="General">📁 General</option>
                    <option value="Research">📚 Research</option>
                    <option value="To Read">⏱️ To Read</option>
                    <option value="Weekend">🏖️ Weekend</option>
                  </select>
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 24,
        padding: '24px 0',
        width: '100%'
      }}>
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : paged.map((item, i) => {
              if (currentPage === 1 && i === 0) return null;
              return item && (
                <Link
                  key={i}
                  to={{
                    pathname: `/news/${encodeURIComponent(item.title)}/${encodeURIComponent(item.author)}/${encodeURIComponent(item.content)}/${encodeURIComponent(item.url)}/${encodeURIComponent(item.urlToImage)}`,
                  }}
                  state={item}
                  className="nd-card nd-news-card"
                  style={{ textDecoration: 'none' }}
                >
                  {/* Thumbnail */}
                  <div className="nd-news-card-img-wrapper">
                    {item.urlToImage ? (
                      <img
                        src={item.urlToImage}
                        alt={item.title}
                        className="nd-news-card-img"
                        onError={e => { e.target.src = ''; e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{
                        height: 180, background: 'var(--bg-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)', fontSize: '2rem',
                      }}>📰</div>
                    )}
                    {/* Bookmark button */}
                    <button
                      className={`nd-news-card-bookmark ${isBookmarked(item.url) ? 'active' : ''}`}
                      onClick={(e) => toggleBookmark(e, item)}
                      title={isBookmarked(item.url) ? 'Remove bookmark' : 'Save article'}
                    >
                      {isBookmarked(item.url)
                        ? <BookmarkCheck size={15} />
                        : <Bookmark size={15} />}
                    </button>
                  </div>

                  {/* Body */}
                  <div className="nd-news-card-body">
                    <div className="nd-news-card-meta">
                      <span className="nd-badge nd-badge-muted" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={10} />
                        {estimateReadTime(item.content || item.description)}
                      </span>
                    </div>
                    <h3 className="nd-news-card-title">{item.title || 'No title'}</h3>
                    <p className="nd-news-card-desc">{item.description || 'No description available.'}</p>
                    {item.author && (
                      <p className="nd-news-card-author">By {item.author}</p>
                    )}
                    {isBookmarksPage && (
                      <div 
                        onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                        style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Folder:</span>
                        <select
                          value={item.tag || 'General'}
                          onChange={(e) => handleTagChange(item.url, e.target.value)}
                          style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            color: 'var(--text-primary)',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            outline: 'none',
                            fontFamily: 'inherit'
                          }}
                        >
                          <option value="General">📁 General</option>
                          <option value="Research">📚 Research</option>
                          <option value="To Read">⏱️ To Read</option>
                          <option value="Weekend">🏖️ Weekend</option>
                        </select>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
        }
      </div>

      {/* Pagination */}
      {pages > 1 && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 0 40px' }}>
          <button
            className="nd-btn nd-btn-ghost nd-btn-sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i + 1}
              className={`nd-btn nd-btn-sm ${currentPage === i + 1 ? 'nd-btn-primary' : 'nd-btn-ghost'}`}
              onClick={() => { setCurrentPage(i + 1); setLoading(true); setTimeout(() => setLoading(false), 800); }}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="nd-btn nd-btn-ghost nd-btn-sm"
            onClick={() => setCurrentPage(p => Math.min(pages, p + 1))}
            disabled={currentPage === pages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

News_Card.propTypes = {
  news: PropTypes.array,
  onBookmarkChange: PropTypes.func,
};

export default News_Card;