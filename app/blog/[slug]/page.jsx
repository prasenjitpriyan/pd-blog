// app/blog/[slug]/page.jsx

import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import BlogPostClientPage from './BlogPostClientPage';

export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({
    slug,
  }));
}

// This remains an async function
export default async function PostPage({ params }) {
  // --- THIS IS THE DEFINITIVE FIX FOR NEXT.JS 15 ---
  // Await the params Promise to get the actual object, then destructure slug.
  const { slug } = await params;

  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    mainImage,
    body,
    likes,
    "authorName": author->name,
    "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt asc) {
      _id,
      name,
      comment,
      _createdAt,
      parentComment
    }
  }`;

  // Now you can use the `slug` variable as before.
  const post = await client.fetch(query, { slug });

  if (!post) {
    notFound();
  }

  return <BlogPostClientPage post={post} />;
}
