import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { UserContext } from './userContext';
import { User, Mail, BookOpen, Flame, Bookmark, TrendingUp, History, Check, Save } from 'lucide-react';

const ALL_GENRES = ['Politics', 'Sports', 'Movies', 'Finance', 'International', 'National'];

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [genreSuccess, setGenreSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/profile/${user}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
        setEmail(data.email || '');
        setSelectedGenres(data.genre || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleEmailSave = async (e) => {
    e.preventDefault();
    setEmailSuccess(false);
    try {
      const res = await fetch('/api/user/profile/email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, email })
      });
      if (res.ok) {
        setEmailSuccess(true);
        setTimeout(() => setEmailSuccess(false), 2000);
      }
    } catch { /* error */ }
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleGenresSave = async () => {
    setGenreSuccess(false);
    try {
      const res = await fetch('/api/user/profile/genre', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, genre: selectedGenres })
      });
      if (res.ok) {
        setGenreSuccess(true);
        setTimeout(() => setGenreSuccess(false), 2000);
      }
    } catch { /* error */ }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Header />

      <main className="nd-feed-layout" style={{ flex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            fontFamily: 'Lora, Georgia, serif',
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: '0 0 6px'
          }}>My Dashboard</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500, fontFamily: 'Plus Jakarta Sans' }}>
            Monitor your reading activity, interest categories, and account details.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="nd-spinner" />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--danger)' }}>
            <p>{error}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="nd-dashboard-grid">
            
            {/* Stats Deck */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {/* Streak */}
              <div className="nd-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20, borderLeft: '3px solid var(--danger)' }}>
                <div style={{
                  color: 'var(--danger)',
                  width: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Flame size={22} />
                </div>
                <div>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>Reading Streak</p>
                  <p style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{profile.readingStreak?.count || 0} Day{profile.readingStreak?.count !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Total Reads */}
              <div className="nd-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20, borderLeft: '3px solid var(--accent)' }}>
                <div style={{
                  color: 'var(--accent)',
                  width: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <BookOpen size={22} />
                </div>
                <div>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>Articles Read</p>
                  <p style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{profile.readArticlesCount || 0}</p>
                </div>
              </div>

              {/* Bookmarks */}
              <div className="nd-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20, borderLeft: '3px solid var(--success)' }}>
                <div style={{
                  color: 'var(--success)',
                  width: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bookmark size={22} />
                </div>
                <div>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>Saved Articles</p>
                  <p style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{profile.bookmarkCount || 0}</p>
                </div>
              </div>
            </div>

            {/* Split layout: Profile Form vs Stats analysis */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 32,
              alignItems: 'start'
            }}>
              {/* Left Column: Account Details & Preferences */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Account Details */}
                <div className="nd-card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 20px' }}>
                    <User size={18} style={{ color: 'var(--accent)' }} />
                    Profile Details
                  </h3>
                  
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{profile.username}</p>
                  </div>

                  <form onSubmit={handleEmailSave}>
                    <div className="nd-form-group" style={{ marginBottom: 16 }}>
                      <label className="nd-input-label" htmlFor="dashEmail">Email Address</label>
                      <div className="nd-input-wrapper">
                        <Mail size={16} className="nd-input-icon" />
                        <input
                          id="dashEmail"
                          type="email"
                          className="nd-input nd-input-with-icon"
                          placeholder="Link your email address"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <button type="submit" className="nd-btn nd-btn-primary" style={{ width: '100%' }}>
                      {emailSuccess ? <Check size={15} /> : <Save size={15} />}
                      {emailSuccess ? 'Saved!' : 'Save Email'}
                    </button>
                  </form>
                </div>

                {/* Genre Preferences */}
                <div className="nd-card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 16px' }}>
                    <Bookmark size={18} style={{ color: 'var(--accent)' }} />
                    Preferred Topics
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
                    Select your interest categories to customize your default feed content.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {ALL_GENRES.map(g => {
                      const selected = selectedGenres.includes(g);
                      return (
                        <button
                          key={g}
                          className={`nd-chip ${selected ? 'nd-chip-blue' : 'nd-chip-outline'}`}
                          onClick={() => handleGenreToggle(g)}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={handleGenresSave} className="nd-btn nd-btn-primary" style={{ width: '100%' }}>
                    {genreSuccess ? <Check size={15} /> : <Save size={15} />}
                    {genreSuccess ? 'Saved Preferences!' : 'Save Preferences'}
                  </button>
                </div>
              </div>

              {/* Right Column: Reading Behavior Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Most Read Categories */}
                <div className="nd-card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 20px' }}>
                    <TrendingUp size={18} style={{ color: 'var(--accent)' }} />
                    Most Read Topics
                  </h3>
                  {(!profile.readGenres || profile.readGenres.length === 0) ? (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                      No reading history tracked yet. Open articles in the feed to analyze your reading metrics!
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {[...profile.readGenres]
                        .sort((a, b) => b.count - a.count)
                        .map(genre => (
                          <div key={genre.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>📁 {genre.name}</span>
                            <span style={{
                              fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)',
                              background: 'rgba(99,102,241,0.08)', padding: '2px 8px', borderRadius: 4
                            }}>{genre.count} read{genre.count !== 1 ? 's' : ''}</span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>

                {/* Synced Search History */}
                <div className="nd-card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 20px' }}>
                    <History size={18} style={{ color: 'var(--accent)' }} />
                    Synced Search History
                  </h3>
                  {(!profile.searchHistory || profile.searchHistory.length === 0) ? (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                      No cloud search records found.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {profile.searchHistory.map((query, idx) => (
                        <span
                          key={idx}
                          className="nd-chip nd-chip-outline"
                          style={{ textTransform: 'capitalize', fontSize: '0.8125rem' }}
                        >
                          {query}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
