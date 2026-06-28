import Header from './Header';
import Footer from './Footer';
import { Newspaper, Users, Globe, Zap } from 'lucide-react';

const TEAM = [
  { name: 'Akberali', role: 'Backend & API Integration', initial: 'A' },
  { name: 'Saachi',   role: 'Frontend & Design',          initial: 'S' },
  { name: 'Atharva',  role: 'Full-Stack & Architecture',  initial: 'T' },
];

const FEATURES = [
  { icon: <Globe size={20} />, label: 'Real-time news from global sources via NewsAPI' },
  { icon: <Zap size={20} />,   label: 'Personalised feeds by genre and search interest' },
  { icon: <Users size={20} />, label: 'Account system with bookmarks synced to MongoDB' },
];

const About_Us = () => {
  const getTeamAvatarStyle = (name) => {
    const hash = Array.from(name || '').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      '#3b82f6',
      '#10b981',
      '#6366f1',
    ];
    return {
      background: 'var(--bg-elevated)',
      color: colors[hash % colors.length],
      border: '1px solid var(--border-strong)',
      fontWeight: 700,
    };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: '60px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Newspaper size={22} style={{ color: 'var(--accent)' }} />
            </div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              fontFamily: 'Lora, Georgia, serif',
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              marginBottom: 12
            }}>
              About NovaDigest
            </h1>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 540, margin: '0 auto', fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}>
              NovaDigest is a modern news aggregator that brings you real-time articles across politics, sports,
              finance, entertainment, and more — tailored to what you actually want to read.
            </p>
          </div>

          {/* Features */}
          <div className="nd-card" style={{ padding: '28px 32px', marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, fontFamily: 'Plus Jakarta Sans' }}>
              What we offer
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)', flexShrink: 0,
                  }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="nd-card" style={{ padding: '28px 32px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, fontFamily: 'Plus Jakarta Sans' }}>
              Our team
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {TEAM.map(m => (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 200px' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', ...getTeamAvatarStyle(m.name)
                  }}>
                    {m.initial}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem', fontFamily: 'Plus Jakarta Sans' }}>{m.name}</p>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans' }}>{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About_Us;