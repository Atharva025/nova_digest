import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import Header from './Header';
import Comments from './Comments';
import { UserContext } from './userContext';
import {
  ArrowLeft, Clock, User, ExternalLink, Zap,
  Volume2, VolumeX, Copy, Check,
  MessageCircle, Share2,
  Bookmark, BookmarkCheck, ALargeSmall,
  AlertCircle, RefreshCw,
} from 'lucide-react';

/* ─── helpers ─────────────────────────────── */
const getReadTime = (text) => {
  if (!text) return null;
  const mins = Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
  return `${mins} min read`;
};

const getTLDR = (text) => {
  if (!text || text.length < 250) return null;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || [])
    .map(s => s.trim())
    .filter(s => s.length > 60 && s.length < 280);
  if (sentences.length < 3) return null;
  const mid = Math.floor(sentences.length / 2);
  return [sentences[0], sentences[mid], sentences[sentences.length - 1]];
};

const FONT_SIZES = {
  sm: { label: 'A',  size: '0.9375rem', line: '1.8'  },
  md: { label: 'A',  size: '1.0625rem', line: '1.9'  },
  lg: { label: 'A',  size: '1.1875rem', line: '1.95' },
};

/* ─── Skeleton ─────────────────────────────── */
const ArticleSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 40 }}>
    {[100, 100, 100, 85, 100, 100, 70, 100, 100, 90].map((w, i) => (
      <div
        key={i}
        className="nd-skeleton nd-article-skeleton-row"
        style={{ width: `${w}%`, height: 20 }}
      />
    ))}
    <div style={{ height: 32 }} />
    {[100, 100, 60].map((w, i) => (
      <div
        key={i + 10}
        className="nd-skeleton nd-article-skeleton-row"
        style={{ width: `${w}%`, height: 20 }}
      />
    ))}
  </div>
);

/* ─── Component ────────────────────────────── */
const News_Full = () => {
  const { title, author, url, urlToImage } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const decodedTitle  = decodeURIComponent(title      || '');
  const decodedAuthor = decodeURIComponent(author     || '');
  const decodedUrl    = decodeURIComponent(url        || '');
  const decodedImg    = decodeURIComponent(urlToImage || '');

  // Pull description from router state if available (passed from News_Card)
  const stateDesc = location.state?.description || '';

  const [text,       setText]       = useState('');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [expanded,   setExpanded]   = useState(false);
  const [fontSize,   setFontSize]   = useState('md');
  const [fontFamily, setFontFamily] = useState('serif');
  const [lineHeight, setLineHeight] = useState('medium');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied,     setCopied]     = useState(false);
  const [scrollPct,  setScrollPct]  = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [imgLoaded,  setImgLoaded]  = useState(false);

  /* scroll progress */
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) setScrollPct((window.scrollY / total) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* bookmark state */
  useEffect(() => {
    const checkBookmark = async () => {
      if (user) {
        try {
          const res = await fetch(`/bookmarks/${user}`);
          if (res.ok) {
            const data = await res.json();
            setBookmarked((data.bookmarks || []).some(b => b.url === decodedUrl));
          }
        } catch { /* offline */ }
      } else {
        const g = JSON.parse(localStorage.getItem('guest_bookmarks') || '[]');
        setBookmarked(g.some(b => b.url === decodedUrl));
      }
    };
    checkBookmark();
  }, [user, decodedUrl]);

  /* fetch article text */
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      setText('');
      try {
        const res = await fetch(`/api/scrape?url=${encodeURIComponent(decodedUrl)}`);
        if (!res.ok) throw new Error("Scraping failed");
        const data = await res.json();
        setText(data.content || stateDesc);

        // Track reading activity if user is logged in
        if (user) {
          const articleGenre = location.state?.genre || 'General';
          fetch('/api/user/track-read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, genre: articleGenre })
          }).catch(() => {});
        }
      } catch {
        setText(stateDesc);
        if (!stateDesc) setError(true);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => window.speechSynthesis?.cancel();
  }, [decodedUrl, stateDesc, user, location.state]);

  /* TTS */
  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const displayText = expanded ? text : text.substring(0, PREVIEW_LEN);
      const u = new SpeechSynthesisUtterance(displayText);
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(u);
      setIsSpeaking(true);
    }
  };

  /* copy link */
  const copyLink = () => {
    navigator.clipboard.writeText(decodedUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  /* bookmark toggle */
  const toggleBookmark = async () => {
    const article = { title: decodedTitle, author: decodedAuthor, url: decodedUrl, urlToImage: decodedImg };
    if (bookmarked) {
      if (user) {
        await fetch('/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, url: decodedUrl }),
        }).catch(() => {});
      } else {
        const g = JSON.parse(localStorage.getItem('guest_bookmarks') || '[]').filter(b => b.url !== decodedUrl);
        localStorage.setItem('guest_bookmarks', JSON.stringify(g));
      }
    } else {
      if (user) {
        await fetch('/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, article }),
        }).catch(() => {});
      } else {
        const g = JSON.parse(localStorage.getItem('guest_bookmarks') || '[]');
        g.push(article);
        localStorage.setItem('guest_bookmarks', JSON.stringify(g));
      }
    }
    setBookmarked(b => !b);
  };

  const PREVIEW_LEN = 1800;
  const tldr = getTLDR(text);
  const showFull = expanded || text.length <= PREVIEW_LEN;
  const displayText = showFull ? text : text.substring(0, PREVIEW_LEN);
  const { size: bodySize, line: bodyLine } = FONT_SIZES[fontSize];

  /* split body into paragraphs for proper rendering */
  const paragraphs = displayText
    ? displayText.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
    : [];

  return (
    <>
      {/* ─── Reading progress bar ─────────────────── */}
      <div className="nd-progress" style={{ width: `${scrollPct}%` }} />

      <Header />

      {/* ─── HERO ─────────────────────────────────── */}
      <section className="nd-article-hero">
        {/* Background image */}
        {decodedImg && (
          <img
            src={decodedImg}
            alt=""
            aria-hidden="true"
            className="nd-article-hero-img"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
            onLoad={() => setImgLoaded(true)}
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
        {/* Gradient overlay */}
        <div className="nd-article-hero-overlay" />

        {/* Hero content */}
        <div className="nd-article-hero-content">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '0.8125rem', fontWeight: 500,
              cursor: 'pointer', marginBottom: 28,
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.18)'; e.target.style.color = '#fff'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.10)'; e.target.style.color = 'rgba(255,255,255,0.75)'; }}
          >
            <ArrowLeft size={14} />
            Back to Feed
          </button>

          {/* Category badge */}
          <div>
            <span className="nd-article-category">
              <Zap size={10} />
              News
            </span>
          </div>

          {/* Title */}
          <h1 className="nd-article-title" style={{ color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
            {decodedTitle || 'Article'}
          </h1>

          {/* Meta row */}
          <div className="nd-article-meta" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {decodedAuthor && (
              <>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <User size={13} />
                  {decodedAuthor}
                </span>
                <span className="nd-article-meta-sep" style={{ background: 'rgba(255,255,255,0.3)' }} />
              </>
            )}
            {!loading && getReadTime(text) && (
              <>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={13} />
                  {getReadTime(text)}
                </span>
                <span className="nd-article-meta-sep" style={{ background: 'rgba(255,255,255,0.3)' }} />
              </>
            )}
            <a
              href={decodedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                color: 'rgba(255,255,255,0.65)',
                textDecoration: 'none', fontSize: '0.875rem',
              }}
            >
              <ExternalLink size={13} />
              Source
            </a>
          </div>
        </div>
      </section>

      {/* ─── ARTICLE BODY ─────────────────────────── */}
      <main className="nd-article-page">

        {/* ── Floating sticky toolbar ── */}
        <div className="nd-article-toolbar">

          {/* Left: font size */}
          <div className="nd-article-toolbar-group" style={{ alignItems: 'center', gap: 2 }}>
            <ALargeSmall size={14} style={{ color: 'var(--text-muted)', marginRight: 4 }} />
            {Object.entries(FONT_SIZES).map(([key, val]) => (
              <button
                key={key}
                className={`nd-font-btn ${fontSize === key ? 'active' : ''}`}
                onClick={() => setFontSize(key)}
                title={`Font size ${key}`}
                style={{ fontSize: key === 'sm' ? '0.75rem' : key === 'lg' ? '1rem' : '0.875rem' }}
              >
                {val.label}
              </button>
            ))}
          </div>

          <div className="nd-article-toolbar-sep" />

          {/* Font Family Selector */}
          <div className="nd-article-toolbar-group" style={{ gap: 2 }}>
            {['serif', 'sans', 'dyslexic'].map(f => (
              <button
                key={f}
                className={`nd-font-btn ${fontFamily === f ? 'active' : ''}`}
                style={{ padding: '0 8px', fontSize: '0.75rem', textTransform: 'capitalize', width: 'auto', borderRadius: 4 }}
                onClick={() => setFontFamily(f)}
                title={`Use ${f} typography`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="nd-article-toolbar-sep" />

          {/* Line Height Selector */}
          <div className="nd-article-toolbar-group" style={{ gap: 2 }}>
            {['normal', 'medium', 'relaxed'].map(lh => (
              <button
                key={lh}
                className={`nd-font-btn ${lineHeight === lh ? 'active' : ''}`}
                style={{ padding: '0 8px', fontSize: '0.75rem', textTransform: 'capitalize', width: 'auto', borderRadius: 4 }}
                onClick={() => setLineHeight(lh)}
                title={`Line height ${lh}`}
              >
                {lh === 'normal' ? '1.5' : lh === 'medium' ? '1.8' : '2.1'}
              </button>
            ))}
          </div>

          <div className="nd-article-toolbar-sep" />

          {/* Centre: TTS */}
          <div className="nd-article-toolbar-group">
            <button
              className={`nd-tool-btn ${isSpeaking ? 'speaking' : ''}`}
              onClick={toggleSpeech}
              disabled={!text || loading}
              title={isSpeaking ? 'Stop reading' : 'Listen to article'}
            >
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {isSpeaking ? 'Stop' : 'Listen'}
            </button>
          </div>

          <div className="nd-article-toolbar-sep" />

          {/* Right: share + bookmark */}
          <div className="nd-article-toolbar-group">
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--text-muted)', fontSize: '0.8125rem', marginRight: 2 }}>
              <Share2 size={13} />
            </span>
            <a
              className="nd-tool-btn"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(decodedTitle)}&url=${encodeURIComponent(decodedUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on X / Twitter"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
              X
            </a>
            <a
              className="nd-tool-btn"
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(decodedTitle + ' — ' + decodedUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
            >
              <MessageCircle size={13} />
              WA
            </a>
            <button className="nd-tool-btn" onClick={copyLink} title="Copy link">
              {copied
                ? <><Check size={13} style={{ color: 'var(--success)' }} /> Copied!</>
                : <><Copy size={13} /> Copy</>
              }
            </button>

            <div className="nd-article-toolbar-sep" />

            <button
              className={`nd-tool-btn ${bookmarked ? 'active' : ''}`}
              onClick={toggleBookmark}
              title={bookmarked ? 'Remove bookmark' : 'Save article'}
            >
              {bookmarked
                ? <BookmarkCheck size={14} />
                : <Bookmark size={14} />
              }
              {bookmarked ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* ── TL;DR card ── */}
        {!loading && tldr && (
          <div className="nd-tldr-card">
            <div className="nd-tldr-title">
              <Zap size={12} />
              Quick Summary
            </div>
            <ul className="nd-tldr-list">
              {tldr.map((pt, i) => (
                <li key={i}>
                  <div className="nd-tldr-bullet">{i + 1}</div>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Article body ── */}
        {loading ? (
          <ArticleSkeleton />
        ) : error && !text ? (
          /* Full error — could not load anything */
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            marginTop: 32,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(239,68,68,0.10)',
              border: '1px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', color: 'var(--danger)',
            }}>
              <AlertCircle size={24} />
            </div>
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontSize: '1.125rem' }}>
              Couldn't load article content
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px', lineHeight: 1.6 }}>
              The article content couldn't be fetched directly. This is usually due to CORS restrictions on the source site.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={decodedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nd-btn nd-btn-primary"
              >
                <ExternalLink size={15} />
                Read on source site
              </a>
              <button
                className="nd-btn nd-btn-secondary"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Paragraphs */}
            <div className={`nd-article-body font-${fontFamily}-reading lh-${lineHeight}-reading`} style={{ fontSize: bodySize }}>
              {paragraphs.map((para, i) => (
                <p key={i} style={{ marginBottom: '1.4em', margin: i === 0 ? undefined : '1.4em 0 0' }}>
                  {para}
                </p>
              ))}
              {!showFull && (
                <p style={{ marginTop: '1.4em' }}>…</p>
              )}
            </div>

            {/* Read more / Show less */}
            {text.length > PREVIEW_LEN && (
              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
                <button
                  className="nd-btn nd-btn-secondary"
                  onClick={() => setExpanded(v => !v)}
                  style={{ minWidth: 160 }}
                >
                  {expanded ? 'Show less' : 'Continue reading →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Source bar ── */}
        {decodedUrl && (
          <div className="nd-article-source-bar">
            <div>
              <p className="nd-article-source-label">Original article</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 2, wordBreak: 'break-all' }}>
                {decodedUrl.length > 70 ? decodedUrl.substring(0, 70) + '…' : decodedUrl}
              </p>
            </div>
            <a
              href={decodedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nd-btn nd-btn-ghost nd-btn-sm"
            >
              <ExternalLink size={13} />
              Open source
            </a>
          </div>
        )}

        {/* ── Comments ── */}
        <Comments articleUrl={decodedUrl} />
      </main>
    </>
  );
};

export default News_Full;
