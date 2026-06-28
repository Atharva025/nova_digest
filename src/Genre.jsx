import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Genres from "../src/components/Genre_Types";
import { Check, ArrowRight, Newspaper } from 'lucide-react';

const GENRE_ICONS = {
  Politics: '🏛️', Sports: '⚽', Movies: '🎬',
  Finance: '📈', International: '🌍', National: '🇮🇳',
};

const Genre = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggle = (name) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const canProceed = selected.length >= 2;

  return (
    <div className="nd-genre-page">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '1.25rem' }}>
            <Newspaper size={20} style={{ color: 'var(--accent)' }} />
            <span className="nd-logo-text">NovaDigest</span>
          </div>
        </div>

        {/* Header */}
        <div className="nd-genre-header">
          <h1 className="nd-genre-heading">What do you want to read?</h1>
          <p className="nd-genre-sub">Select at least 2 interests to personalize your news feed.</p>
        </div>

        {/* Selected pills */}
        <div className="nd-genre-selected-pills">
          {selected.length === 0 ? (
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No genres selected yet</span>
          ) : selected.map(name => (
            <span key={name} className="nd-chip nd-chip-blue">
              <Check size={11} />
              {GENRE_ICONS[name]} {name}
            </span>
          ))}
        </div>

        {/* Genre grid */}
        <div className="nd-genre-grid">
          {Genres.map(g => (
            <div
              key={g.name}
              className={`nd-genre-tile ${selected.includes(g.name) ? 'selected' : ''}`}
              onClick={() => toggle(g.name)}
            >
              <img
                src={g.image}
                alt={g.name}
                className="nd-genre-tile-img"
                onError={e => { e.target.style.display = 'none'; }}
              />
              {/* Colored fallback background when no image */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                zIndex: -1,
              }} />
              <div className="nd-genre-tile-check">
                <Check size={14} color="#fff" strokeWidth={3} />
              </div>
              <div className="nd-genre-tile-overlay">
                <span className="nd-genre-tile-name">
                  {GENRE_ICONS[g.name]} {g.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="nd-btn nd-btn-primary"
            style={{ minWidth: 200, opacity: canProceed ? 1 : 0.45, cursor: canProceed ? 'pointer' : 'not-allowed' }}
            onClick={() => {
              if (canProceed) navigate("/home", { state: { arr: selected } });
            }}
          >
            Start Reading
            <ArrowRight size={16} />
          </button>
        </div>
        {!canProceed && (
          <p style={{ textAlign: 'center', marginTop: 10, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Select {2 - selected.length} more to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default Genre;