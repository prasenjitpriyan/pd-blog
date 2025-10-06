import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'comment',
      type: 'text',
      validation: (Rule) => Rule.required().min(5).max(500),
    }),
    defineField({
      name: 'post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parentComment',
      title: 'Parent Comment',
      type: 'reference',
      to: [{ type: 'comment' }],
      description: 'Link to the parent comment if this is a reply.',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'moderationNotes',
      title: 'Moderation Notes',
      type: 'text',
    }),
  ],
  initialValue: {
    approved: false,
  },
  preview: {
    select: {
      name: 'name',
      comment: 'comment',
      post: 'post.title',
      createdAt: 'createdAt',
    },
    prepare({ name, comment, post, createdAt }) {
      return {
        title: `${name} on ${post}`,
        subtitle: `${comment} (${createdAt ? new Date(createdAt).toLocaleDateString() : ''})`,
      };
    },
  },
});
