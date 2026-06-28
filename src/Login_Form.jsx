import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from './userContext.js';
import { Newspaper, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Quote } from 'lucide-react';

const QUOTES = [
  {
    text: "NovaDigest has completely changed how I read news. The curated feeds keep me focused on the topics I care about most without the sensationalist clutter.",
    author: "Elena Rostova, Software Engineer"
  },
  {
    text: "The audio synthesis makes it incredibly easy to catch up on the daily digest during my morning runs. Premium quality, absolutely seamless.",
    author: "Marcus Vance, Financial Analyst"
  },
  {
    text: "A clean interface, no ads, and custom font scaling. It is rare to find a news portal designed this thoughtfully for visual comfort.",
    author: "Dr. Sarah Jenkins, Researcher"
  }
];

const Login_Form = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [alertState, setAlertState] = useState(null); // null | 'success' | 'error'
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Quote rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertState(null);
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.user) {
          setUser(userData.user.username);
          setAlertState('success');
          setAlertMsg('Login successful! Redirecting…');
          setTimeout(() => navigate("/home"), 800);
        }
      } else {
        const err = await response.json();
        setAlertState('error');
        setAlertMsg(err.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setAlertState('error');
      setAlertMsg('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nd-auth-container">
      {/* Left Pane - Promotional Branding */}
      <div className="nd-auth-left">
        <div className="nd-auth-left-logo">
          <Newspaper size={24} style={{ color: 'var(--accent)' }} />
          <span className="nd-logo-text">NovaDigest</span>
        </div>

        <div className="nd-auth-left-content">
          <h1 className="nd-auth-left-title">
            Curated intelligence, tailored for you.
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
            Access a clean, modern, and customizable news workspace. Control how you consume, hear, and organize your daily updates.
          </p>

          {/* Testimonial Quote Carousel */}
          <div className="nd-quote-card">
            <Quote size={24} style={{ color: 'var(--border-strong)', position: 'absolute', top: 12, right: 16 }} />
            <p className="nd-quote-text">
              "{QUOTES[quoteIndex].text}"
            </p>
            <p className="nd-quote-author">
              — {QUOTES[quoteIndex].author}
            </p>
          </div>
        </div>

        <div className="nd-auth-left-footer">
          &copy; {new Date().getFullYear()} NovaDigest. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Form Card */}
      <div className="nd-auth-right">
        <div className="nd-auth-card" style={{ boxShadow: 'none', border: '1px solid var(--border-default)' }}>
          <div className="nd-auth-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, gap: 6 }}>
            <Newspaper size={20} style={{ color: 'var(--accent)' }} />
            <span className="nd-logo-text">NovaDigest</span>
          </div>
          <p className="nd-auth-subtitle" style={{ textAlign: 'center', marginBottom: 28 }}>
            Welcome back. Sign in to your account.
          </p>

          {/* Alert */}
          {alertState && (
            <div className={`nd-alert ${alertState === 'success' ? 'nd-alert-success' : 'nd-alert-error'}`} style={{ marginBottom: 20 }}>
              {alertState === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {alertMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="nd-form-group">
              <label className="nd-input-label" htmlFor="loginName">Username</label>
              <div className="nd-input-wrapper">
                <Mail size={16} className="nd-input-icon" />
                <input
                  id="loginName"
                  type="text"
                  className="nd-input nd-input-with-icon"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="nd-form-group">
              <label className="nd-input-label" htmlFor="loginPass">Password</label>
              <div className="nd-input-wrapper">
                <Lock size={16} className="nd-input-icon" />
                <input
                  id="loginPass"
                  type={showPass ? 'text' : 'password'}
                  className="nd-input nd-input-with-icon"
                  style={{ paddingRight: 44 }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: 'absolute', right: 14,
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="nd-btn nd-btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="nd-divider" />

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/sign_up" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login_Form;
