import { client } from '@/sanity/lib/client';
import HomePageClient from './HomePageClient'; // Import the new client component

// This function fetches the data from Sanity on the server
async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    "authorName": author->name
  }`;

  const posts = await client.fetch(query);
  return posts;
}

// This remains a Server Component
export default async function HomePage() {
  const posts = await getPosts();

  // Pass the server-fetched data as a prop to the client component
  return <HomePageClient posts={posts} />;
}
