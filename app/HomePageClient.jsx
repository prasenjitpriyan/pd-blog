'use client';

import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import PostDate from './components/PostDate';

export default function HomePageClient({ posts }) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        Latest Articles
      </h1>

      {!posts?.length ? (
        <p className="text-center text-gray-500">
          No posts have been published yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group block border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
              {post.mainImage ? (
                <img
                  className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                  src={urlFor(post.mainImage).width(500).height(300).url()}
                  alt={post.title}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-52 bg-gray-100"></div>
              )}

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500">
                  By <span className="font-medium">{post.authorName}</span> on{' '}
                  <PostDate dateString={post.publishedAt} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
