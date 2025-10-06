'use client';

import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import PostDate from './components/PostDate';

export default function HomePageClient({ posts }) {
  return (
    <div>
      <h1 className="home-title">Latest Articles</h1>

      {!posts ||
        (posts.length === 0 && (
          <p>No posts have been published yet. Check back soon!</p>
        ))}

      <div className="post-grid">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="post-card">
            {post.mainImage ? (
              <img
                className="post-card-image"
                src={urlFor(post.mainImage).width(500).height(300).url()}
                alt={post.title}
              />
            ) : (
              <div className="post-card-image-placeholder"></div>
            )}
            <div className="post-card-content">
              <h3 className="post-card-title">{post.title}</h3>
              <p className="post-card-meta">
                By {post.authorName} on {/* USE THE NEW COMPONENT HERE */}
                <PostDate dateString={post.publishedAt} />
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* styled-jsx is now safe to use here because of 'use client' */}
      <style jsx>{`
        .home-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 2rem;
        }
        .post-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .post-card {
          display: block;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          overflow: hidden;
          transition:
            transform 0.2s ease-in-out,
            box-shadow 0.2s ease-in-out;
        }
        .post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .post-card-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .post-card-image-placeholder {
          width: 100%;
          height: 200px;
          background-color: #f0f0f0;
        }
        .post-card-content {
          padding: 1rem;
        }
        .post-card-title {
          margin: 0 0 0.5rem;
          font-size: 1.25rem;
          color: var(--text-color);
        }
        .post-card-meta {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}
