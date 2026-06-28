import { Newspaper } from 'lucide-react';

const Loader = () => (
  <div style={{
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  }}>
    {/* Animated logo */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: '1.5rem',
      opacity: 0.9,
    }}>
      <Newspaper size={24} style={{ color: 'var(--accent)' }} />
      <span className="nd-logo-text">NovaDigest</span>
    </div>

    {/* Spinner */}
    <div className="nd-spinner" />

    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loading your feed…</p>
  </div>
);

export default Loader;
