'use client';

import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { useEffect, useState } from 'react';

// A reusable form component for both new comments and replies
function CommentForm({ postId, parentCommentId = null, onCommentSubmitted }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment || !postId) {
      setError('Name and comment are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/handle-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createComment',
          payload: {
            _id: postId,
            name,
            email,
            comment,
            parentCommentId,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to submit comment.');

      // Optimistically add comment to the UI
      onCommentSubmitted({
        name,
        comment,
        _createdAt: new Date().toISOString(),
      });

      // Clear form
      setName('');
      setEmail('');
      setComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h4>{parentCommentId ? 'Write a Reply' : 'Leave a Comment'}</h4>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Your Name*"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Your Email (not published)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Your Comment*"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows="4"
        required></textarea>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

// Main component to render the entire page
export default function BlogPostClientPage({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [replyTo, setReplyTo] = useState(null); // State to track which comment to reply to

  // Check localStorage to see if the user has already liked this post
  useEffect(() => {
    if (window.localStorage.getItem(`liked-${post._id}`)) {
      setAlreadyLiked(true);
    }
  }, [post._id]);

  const handleLike = async () => {
    if (alreadyLiked) return;

    // Optimistic UI update
    setLikes((prevLikes) => prevLikes + 1);
    setAlreadyLiked(true);
    window.localStorage.setItem(`liked-${post._id}`, 'true');

    // Call the API route
    try {
      await fetch('/api/handle-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'likePost',
          payload: { _id: post._id },
        }),
      });
    } catch (error) {
      console.error('Failed to update like count:', error);
      // Optional: Revert optimistic update on failure
      setLikes((prevLikes) => prevLikes - 1);
      setAlreadyLiked(false);
      window.localStorage.removeItem(`liked-${post._id}`);
    }
  };

  const handleNewComment = (newCommentData) => {
    // Add a temporary flag to show it's pending
    const optimisticComment = { ...newCommentData, isPending: true };
    setComments((prevComments) => [...prevComments, optimisticComment]);
  };

  const handleNewReply = (newReplyData, parentId) => {
    const optimisticReply = {
      ...newReplyData,
      isPending: true,
      parentComment: { _ref: parentId },
    };
    setComments((prevComments) => [...prevComments, optimisticReply]);
    setReplyTo(null); // Close the reply form after submitting
  };

  const topLevelComments = comments.filter((c) => !c.parentComment);

  return (
    <article className="blog-post">
      <h1>{post.title}</h1>
      <p className="author-info">By {post.authorName}</p>

      {post.mainImage && (
        <img
          src={urlFor(post.mainImage).width(800).url()}
          alt={post.title}
          className="main-image"
        />
      )}

      <div className="post-body">
        <PortableText value={post.body} />
      </div>

      <div className="interactions-section">
        <button
          onClick={handleLike}
          disabled={alreadyLiked}
          className="like-button">
          ❤️ {likes} Like{likes !== 1 && 's'}{' '}
          {alreadyLiked && '(You liked this!)'}
        </button>
      </div>

      <hr />

      <section className="comments-section">
        <h2>Comments ({topLevelComments.length})</h2>
        <CommentForm postId={post._id} onCommentSubmitted={handleNewComment} />

        <div className="comment-list">
          {topLevelComments.map((comment) => (
            <div
              key={comment._id || comment._createdAt}
              className={`comment ${comment.isPending ? 'pending' : ''}`}>
              <p>
                <strong>{comment.name}</strong>{' '}
                {comment.isPending && <em>(Pending approval)</em>}
              </p>
              <p>{comment.comment}</p>
              <button
                className="reply-button"
                onClick={() =>
                  setReplyTo(
                    replyTo === (comment._id || comment._createdAt)
                      ? null
                      : comment._id || comment._createdAt
                  )
                }>
                {replyTo === (comment._id || comment._createdAt)
                  ? 'Cancel Reply'
                  : 'Reply'}
              </button>

              {/* Nested Replies */}
              <div className="replies">
                {comments
                  .filter((reply) => reply.parentComment?._ref === comment._id)
                  .map((reply) => (
                    <div
                      key={reply._id || reply._createdAt}
                      className={`comment reply ${reply.isPending ? 'pending' : ''}`}>
                      <p>
                        <strong>{reply.name}</strong>{' '}
                        {reply.isPending && <em>(Pending approval)</em>}
                      </p>
                      <p>{reply.comment}</p>
                    </div>
                  ))}
              </div>

              {replyTo === (comment._id || comment._createdAt) && (
                <div className="reply-form-container">
                  <CommentForm
                    postId={post._id}
                    parentCommentId={comment._id}
                    onCommentSubmitted={(newReply) =>
                      handleNewReply(newReply, comment._id)
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Basic Styling */}
      <style jsx>{`
        .blog-post {
          max-width: 800px;
          margin: 2rem auto;
          font-family: sans-serif;
        }
        .main-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .like-button {
          font-size: 1rem;
          padding: 10px 15px;
          cursor: pointer;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        .like-button:disabled {
          cursor: not-allowed;
          background: #eee;
        }
        .comments-section {
          margin-top: 2rem;
        }
        .comment-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 2rem;
          border: 1px solid #eee;
          padding: 1rem;
          border-radius: 5px;
        }
        .comment-form input,
        .comment-form textarea {
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .comment-form button {
          align-self: flex-start;
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .comment-form button:disabled {
          background-color: #ccc;
        }
        .comment-list .comment {
          border: 1px solid #eee;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 5px;
        }
        .comment.pending {
          opacity: 0.7;
          border-style: dashed;
        }
        .reply-button {
          font-size: 0.8rem;
          background: none;
          border: none;
          color: #0070f3;
          cursor: pointer;
          padding: 0;
          margin-top: 5px;
        }
        .replies {
          margin-left: 2rem;
          border-left: 2px solid #eee;
          padding-left: 1rem;
          margin-top: 1rem;
        }
        .reply {
          background-color: #f9f9f9;
        }
        .reply-form-container {
          margin-left: 2rem;
          margin-top: 1rem;
        }
        .error-message {
          color: red;
        }
      `}</style>
    </article>
  );
}
