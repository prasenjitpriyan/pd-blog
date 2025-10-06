'use client';

import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { useEffect, useState } from 'react';

function CommentForm({ postId, parentCommentId = null, onCommentSubmitted }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) {
      setError('Name and comment are required.');
      return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
      action: 'createComment',
      payload: { postId, name, email, comment, parentCommentId },
    };

    try {
      const res = await fetch('/api/handle-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || errorData.message || 'Failed to submit comment.'
        );
      }

      onCommentSubmitted({
        name,
        comment,
        _createdAt: new Date().toISOString(),
      });

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-4 border rounded-lg bg-white shadow-sm">
      <h4 className="text-lg font-semibold text-gray-800">
        {parentCommentId ? 'Write a Reply' : 'Leave a Comment'}
      </h4>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Your Name*"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="email"
        placeholder="Your Email (not published)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Your Comment*"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`self-start px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

export default function BlogPostClientPage({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    if (window.localStorage.getItem(`liked-${post._id}`)) {
      setAlreadyLiked(true);
    }
  }, [post._id]);

  const handleLike = async () => {
    if (alreadyLiked) return;

    setLikes((prev) => prev + 1);
    setAlreadyLiked(true);
    window.localStorage.setItem(`liked-${post._id}`, 'true');

    try {
      await fetch('/api/handle-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'likePost',
          payload: { postId: post._id },
        }),
      });
    } catch (err) {
      console.error('Failed to update like count:', err);
      setLikes((prev) => prev - 1);
      setAlreadyLiked(false);
      window.localStorage.removeItem(`liked-${post._id}`);
    }
  };

  const handleNewComment = (newComment) => {
    setComments((prev) => [...prev, { ...newComment, isPending: true }]);
  };

  const handleNewReply = (newReply, parentId) => {
    setComments((prev) => [
      ...prev,
      { ...newReply, isPending: true, parentComment: { _ref: parentId } },
    ]);
    setReplyTo(null);
  };

  const topLevelComments = comments.filter((c) => !c.parentComment);

  return (
    <article className="max-w-3xl mx-auto px-4 py-10 font-sans text-gray-800">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
        {post.title}
      </h1>
      <p className="text-gray-500 mb-6">By {post.authorName}</p>

      {post.mainImage && (
        <img
          src={urlFor(post.mainImage).width(800).url()}
          alt={post.title}
          className="w-full h-auto rounded-lg mb-8"
        />
      )}

      <div className="prose prose-blue max-w-none mb-8">
        <PortableText value={post.body} />
      </div>

      <div className="mb-8">
        <button
          onClick={handleLike}
          disabled={alreadyLiked}
          className={`px-4 py-2 text-sm font-medium border rounded-md transition-all ${
            alreadyLiked
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
              : 'bg-white border-gray-300 hover:bg-blue-600 hover:text-white'
          }`}>
          ❤️ {likes} Like{likes !== 1 ? 's' : ''}{' '}
          {alreadyLiked && '(You liked this!)'}
        </button>
      </div>

      <hr className="my-8 border-gray-200" />

      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Comments ({topLevelComments.length})
        </h2>

        <CommentForm postId={post._id} onCommentSubmitted={handleNewComment} />

        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <div
              key={comment._id || comment._createdAt}
              className={`border border-gray-200 rounded-lg p-4 ${
                comment.isPending ? 'opacity-70 border-dashed' : ''
              }`}>
              <p className="font-semibold">
                {comment.name}{' '}
                {comment.isPending && (
                  <span className="text-sm text-gray-400">
                    (Pending approval)
                  </span>
                )}
              </p>
              <p className="mt-1 text-gray-700">{comment.comment}</p>

              <button
                onClick={() =>
                  setReplyTo(
                    replyTo === (comment._id || comment._createdAt)
                      ? null
                      : comment._id || comment._createdAt
                  )
                }
                className="text-blue-600 text-sm mt-2 hover:underline">
                {replyTo === (comment._id || comment._createdAt)
                  ? 'Cancel Reply'
                  : 'Reply'}
              </button>

              {replyTo === (comment._id || comment._createdAt) && (
                <div className="mt-3">
                  <CommentForm
                    postId={post._id}
                    parentCommentId={comment._id}
                    onCommentSubmitted={(reply) =>
                      handleNewReply(reply, comment._id)
                    }
                  />
                </div>
              )}

              <div className="ml-5 mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                {comments
                  .filter((r) => r.parentComment?._ref === comment._id)
                  .map((reply) => (
                    <div
                      key={reply._id || reply._createdAt}
                      className={`rounded-md p-3 bg-gray-50 ${reply.isPending ? 'opacity-70' : ''}`}>
                      <p className="font-semibold">
                        {reply.name}{' '}
                        {reply.isPending && (
                          <span className="text-sm text-gray-400">
                            (Pending approval)
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-gray-700">{reply.comment}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
