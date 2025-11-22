import React, { useState } from 'react';
import { formatDate } from '../../utils/dateFormat';

function CommentItem({ 
  comment, 
  currentUserId, 
  onUsernameClick, 
  onDelete, 
  onReply, 
  onReplySubmit,
  isSubmittingReply,
  replies = [],
  isExpanded = false,
  onToggleReplies
}) {
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  const handleSubmitReply = () => {
    if (replyText.trim() && onReplySubmit) {
      onReplySubmit(comment.id, replyText);
      setReplyText('');
      setIsReplying(false);
    }
  };

  const handleCancelReply = () => {
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-header" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onUsernameClick(comment.username)}
            disabled={!comment.username}
            className="comment-username"
            style={{
              fontWeight: '600',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: comment.username ? 'pointer' : 'default',
              padding: 0,
              textDecoration: comment.username ? 'underline' : 'none'
            }}
          >
            {comment.username || 'Unknown User'}
          </button>
          {comment.is_pt && (
            <img 
              src="https://images.credential.net/badge/tiny/kt0vexxs_1761580077325_badge.png" 
              alt="Verified Personal Trainer" 
              style={{
                height: '18px',
                width: 'auto',
                verticalAlign: 'middle'
              }}
            />
          )}
        </div>
        <span className="comment-time" style={{ 
          color: 'var(--text-secondary)',
          fontSize: '0.85rem'
        }}>
          {formatDate(comment.created_at)}
        </span>
      </div>
      
      <p className="comment-content" style={{ 
        margin: '0 0 8px 0',
        lineHeight: '1.5',
        fontStyle: comment.content === 'User deleted this comment' ? 'italic' : 'normal',
        color: comment.content === 'User deleted this comment' ? 'var(--text-secondary)' : 'var(--text-primary)'
      }}>
        {comment.content}
      </p>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {onReply && (
          <button
            onClick={handleReplyClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: '4px 8px'
            }}
          >
            Reply
          </button>
        )}
        
        {comment.reply_count > 0 && onToggleReplies && (
          <button
            onClick={onToggleReplies}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: '4px 8px'
            }}
          >
            {isExpanded ? 'Hide' : `View ${comment.reply_count} ${comment.reply_count === 1 ? 'reply' : 'replies'}`}
          </button>
        )}
        
        {comment.content !== 'User deleted this comment' && comment.user_id === currentUserId && onDelete && (
          <button
            className="comment-delete"
            onClick={() => onDelete(comment.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-orange)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: '4px 8px'
            }}
          >
            Delete
          </button>
        )}
      </div>
      
      {isReplying && (
        <div style={{ marginTop: '12px', marginLeft: '20px' }}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={2}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={handleSubmitReply}
              disabled={!replyText.trim() || isSubmittingReply}
              style={{
                padding: '6px 12px',
                fontSize: '0.85rem',
                background: 'var(--accent-green)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: (!replyText.trim() || isSubmittingReply) ? 'not-allowed' : 'pointer',
                opacity: (!replyText.trim() || isSubmittingReply) ? 0.5 : 1
              }}
            >
              {isSubmittingReply ? 'Posting...' : 'Post Reply'}
            </button>
            <button
              onClick={handleCancelReply}
              disabled={isSubmittingReply}
              style={{
                padding: '6px 12px',
                fontSize: '0.85rem',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: isSubmittingReply ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentItem;

