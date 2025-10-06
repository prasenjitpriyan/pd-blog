// app/api/handle-interaction/route.js
import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

// Create a dedicated client for writing data
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false, // Must be false for writes
  token: process.env.SANITY_API_WRITE_TOKEN, // Use the write token
});

export async function POST(request) {
  const { action, payload } = await request.json();

  if (action === 'createComment') {
    const { _id, name, email, comment, parentCommentId } = payload;
    try {
      const newComment = {
        _type: 'comment',
        post: {
          _type: 'reference',
          _ref: _id,
        },
        name,
        email,
        comment,
      };

      // If it's a reply, add the parent reference
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
      return NextResponse.json(
        { message: 'Error submitting comment', err },
        { status: 500 }
      );
    }
  }

  if (action === 'likePost') {
    const { _id } = payload;
    try {
      // Use a patch to increment the 'likes' field
      const result = await writeClient
        .patch(_id)
        .setIfMissing({ likes: 0 })
        .inc({ likes: 1 })
        .commit();
      return NextResponse.json({ likes: result.likes }, { status: 200 });
    } catch (err) {
      return NextResponse.json(
        { message: 'Error liking post', err },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
}
