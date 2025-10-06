import { client } from '@/sanity/lib/client';
import HomePageClient from './HomePageClient';

async function getPosts() {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      "authorName": author->name
    }
  `;
  try {
    const posts = await client.fetch(query);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();

  return <HomePageClient posts={posts} />;
}
