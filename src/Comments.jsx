import { useState, useEffect, useContext } from "react";
import { MessageSquare, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserContext } from "./userContext";

const getAvatarStyle = (name) => {
  const hash = Array.from(name || '').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#6366f1',
    '#8b5cf6',
  ];
  return {
    background: 'var(--bg-elevated)',
    color: colors[hash % colors.length],
    border: '1px solid var(--border-strong)',
    fontWeight: 700,
  };
};

const Comments = ({ articleUrl }) => {
  const { user } = useContext(UserContext);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch comments from MongoDB
  const fetchComments = async () => {
    if (!articleUrl) return;
    try {
      const res = await fetch(`/api/comments?url=${encodeURIComponent(articleUrl)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleUrl]);

  const submit = async () => {
    if (!comment.trim() || !user || !articleUrl) return;
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user,
          url: articleUrl,
          comment: comment.trim()
        })
      });
      if (res.ok) {
        setComment('');
        fetchComments(); // Reload comments list
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  return (
    <div className="nd-comments" style={{ marginTop: 40, borderTop: '1px solid var(--border-default)', paddingTop: 32 }}>
      <h3 className="nd-comments-title" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 24px', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
        <MessageSquare size={20} style={{ color: 'var(--accent)' }} />
        Discussion {comments.length > 0 && <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.875rem' }}>({comments.length})</span>}
      </h3>

      {/* Input */}
      {user ? (
        <div className="nd-comment-input-area" style={{ marginBottom: 28 }}>
          <textarea
            className="nd-input"
            style={{ height: 'auto', minHeight: 80, padding: '12px 16px', resize: 'vertical', lineHeight: 1.5, background: 'var(--bg-subtle)' }}
            placeholder={`Comment as ${user}…`}
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) submit(); }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="nd-btn nd-btn-primary nd-btn-sm" onClick={submit} disabled={!comment.trim()}>
              <Send size={13} />
              Post comment
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center', padding: '20px',
          background: 'var(--bg-subtle)', border: '1px dashed var(--border-default)',
          borderRadius: 'var(--radius-lg)', marginBottom: 28
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 12px' }}>
            You must be logged in to participate in the discussion.
          </p>
          <Link to="/login" className="nd-btn nd-btn-primary nd-btn-sm" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            Sign In to Comment
          </Link>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
          <div className="nd-spinner" style={{ width: 24, height: 24 }} />
        </div>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
          Be the first to comment.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comments.map((c, i) => (
            <div className="nd-comment-item" key={c._id || i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '12px 0' }}>
              <div className="nd-comment-avatar" style={{ ...getAvatarStyle(c.userName), width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', flexShrink: 0 }}>
                {c.userName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <p className="nd-comment-username" style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.userName}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="nd-comment-text" style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;