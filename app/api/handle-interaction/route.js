import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(request) {
  try {
    const { action, payload } = await request.json();

    switch (action) {
      case 'createComment':
        return await createComment(payload);

      case 'likePost':
        return await likePost(payload);

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error('🔥 API Error:', err);
    return NextResponse.json(
      { message: 'Unexpected server error', error: err.message },
      { status: 500 }
    );
  }
}

/**
 * Create a comment for a post
 */
async function createComment({
  postId,
  name,
  email,
  comment,
  parentCommentId,
}) {
  try {
    const newComment = {
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: postId,
      },
      name,
      email,
      comment,
      approved: false, // Enforce moderation
      createdAt: new Date().toISOString(),
    };

    if (parentCommentId) {
      newComment.parentComment = {
        _type: 'reference',
        _ref: parentCommentId,
      };
    }

    await writeClient.create(newComment);

    return NextResponse.json(
      { message: 'Comment submitted for approval!' },
      { status: 200 }
    );
  } catch (err) {
    console.error('🔥 Sanity Error creating comment:', err);
    return NextResponse.json(
      { message: 'Error submitting comment', error: err.message },
      { status: 500 }
    );
  }
}

/**
 * Like a post
 */
async function likePost({ postId }) {
  try {
    const updatedPost = await writeClient
      .patch(postId)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit();

    return NextResponse.json(
      { likes: updatedPost.likes || 0 },
      { status: 200 }
    );
  } catch (err) {
    console.error('🔥 Sanity Error liking post:', err);
    return NextResponse.json(
      { message: 'Error liking post', error: err.message },
      { status: 500 }
    );
  }
}
