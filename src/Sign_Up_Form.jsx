import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from './userContext.js';
import Genres from "../src/components/Genre_Types";
import { Newspaper, Mail, Lock, Eye, EyeOff, AlertCircle, Check, Quote } from 'lucide-react';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,30}$/;
const usernameRegex = /^[a-zA-Z0-9]+$/;

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

const Sign_Up_Form = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Quote rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.username.trim()) {
      e.username = 'Username is required';
    } else if (!usernameRegex.test(formData.username)) {
      e.username = 'Only letters and numbers allowed';
    }
    if (!formData.password.trim()) {
      e.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      e.password = 'Must be 6–30 characters with at least 1 letter and 1 number';
    }
    if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }
    if (selectedGenres.length < 2) {
      e.genres = 'Please select at least 2 genres';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const toggleGenre = (name) => {
    setSelectedGenres(prev =>
      prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
    );
    setErrors(prev => ({ ...prev, genres: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const response = await fetch("/api/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, genre: selectedGenres }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user.username);
        navigate("/home", { state: { arr: selectedGenres } });
      } else {
        const errData = await response.json();
        setApiError(errData.error || 'Registration failed. Please try again.');
      }
    } catch {
      setApiError('Cannot connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const GENRE_ICONS = { Politics: '🏛️', Sports: '⚽', Movies: '🎬', Finance: '📈', International: '🌍', National: '🇮🇳' };

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
      <div className="nd-auth-right" style={{ alignItems: 'flex-start', padding: '48px 24px' }}>
        <div className="nd-auth-card" style={{ width: '100%', maxWidth: 480, boxShadow: 'none', border: '1px solid var(--border-default)' }}>
          <div className="nd-auth-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, gap: 6 }}>
            <Newspaper size={20} style={{ color: 'var(--accent)' }} />
            <span className="nd-logo-text">NovaDigest</span>
          </div>
          <p className="nd-auth-subtitle" style={{ textAlign: 'center', marginBottom: 28 }}>
            Create your account and start reading personalized news.
          </p>

          {apiError && (
            <div className="nd-alert nd-alert-error" style={{ marginBottom: 20 }}>
              <AlertCircle size={16} />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="nd-form-group">
              <label className="nd-input-label" htmlFor="typeName">Username</label>
              <div className="nd-input-wrapper">
                <Mail size={16} className="nd-input-icon" />
                <input
                  id="typeName"
                  type="text"
                  className="nd-input nd-input-with-icon"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={e => setFormData(p => ({ ...p, username: e.target.value }))}
                  style={errors.username ? { borderColor: 'var(--danger)' } : {}}
                />
              </div>
              {errors.username && <p className="nd-error-text"><AlertCircle size={12} />{errors.username}</p>}
            </div>

            {/* Password */}
            <div className="nd-form-group">
              <label className="nd-input-label" htmlFor="typePass">Password</label>
              <div className="nd-input-wrapper">
                <Lock size={16} className="nd-input-icon" />
                <input
                  id="typePass"
                  type={showPass ? 'text' : 'password'}
                  className="nd-input nd-input-with-icon"
                  style={{ paddingRight: 44, ...(errors.password ? { borderColor: 'var(--danger)' } : {}) }}
                  placeholder="6–30 chars, letters + numbers"
                  value={formData.password}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 14, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="nd-error-text"><AlertCircle size={12} />{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="nd-form-group">
              <label className="nd-input-label" htmlFor="typeRePass">Confirm Password</label>
              <div className="nd-input-wrapper">
                <Lock size={16} className="nd-input-icon" />
                <input
                  id="typeRePass"
                  type={showConfirmPass ? 'text' : 'password'}
                  className="nd-input nd-input-with-icon"
                  style={{ paddingRight: 44, ...(errors.confirmPassword ? { borderColor: 'var(--danger)' } : {}) }}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                />
                <button type="button" onClick={() => setShowConfirmPass(v => !v)}
                  style={{ position: 'absolute', right: 14, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="nd-error-text"><AlertCircle size={12} />{errors.confirmPassword}</p>}
            </div>

            {/* Genre Selection */}
            <div className="nd-form-group">
              <label className="nd-input-label">Select your interests <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(pick at least 2)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {Genres.map(g => {
                  const sel = selectedGenres.includes(g.name);
                  return (
                    <button
                      type="button"
                      key={g.name}
                      onClick={() => toggleGenre(g.name)}
                      className={`nd-chip ${sel ? 'nd-chip-blue' : 'nd-chip-outline'}`}
                    >
                      {sel && <Check size={12} />}
                      {GENRE_ICONS[g.name]} {g.name}
                    </button>
                  );
                })}
              </div>
              {errors.genres && <p className="nd-error-text" style={{ marginTop: 6 }}><AlertCircle size={12} />{errors.genres}</p>}
            </div>

            <button
              type="submit"
              className="nd-btn nd-btn-primary"
              style={{ width: '100%', marginTop: 4 }}
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="nd-divider" />
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sign_Up_Form;