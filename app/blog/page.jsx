import { client } from '@/sanity/lib/client';
import BlogPostClientPage from './BlogPostClientPage';

// This function enables Static Site Generation for your blog posts
export async function generateStaticParams() {
  const slugs = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({
    slug,
  }));
}

// The main server component for the page
export default async function PostPage({ params }) {
  const { slug } = params;

  // GROQ query to get the post and its approved comments/replies
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

  const post = await client.fetch(query, { slug });

  if (!post) {
    return <div>Post not found</div>; // Or a proper 404 page
  }

  // Pass the server-fetched data to the interactive client component
  return <BlogPostClientPage post={post} />;
}
