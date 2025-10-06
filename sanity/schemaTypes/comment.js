// sanity/schemaTypes/comment.js
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      title: 'Approved',
      name: 'approved',
      type: 'boolean',
      description: "Comments won't show on the site without approval.",
    }),
    defineField({
      name: 'email',
      type: 'string',
    }),
    defineField({
      name: 'comment',
      type: 'text',
    }),
    defineField({
      name: 'post',
      type: 'reference',
      to: [{ type: 'post' }],
    }),
    // This is the magic field for replies!
    defineField({
      name: 'parentComment',
      title: 'Parent Comment',
      type: 'reference',
      to: [{ type: 'comment' }],
      description: 'Link to the parent comment if this is a reply.',
    }),
  ],
  initialValue: {
    approved: false, // Default comments to not approved for moderation
  },
  preview: {
    select: {
      name: 'name',
      comment: 'comment',
      post: 'post.title',
    },
    prepare({ name, comment, post }) {
      return {
        title: `${name} on ${post}`,
        subtitle: comment,
      };
    },
  },
});
