// sanity/structure.js

/**
 * This is the configuration for the desk tool.
 * It is used to create the structure of the studio's content.
 */
export const structure = (S) =>
  S.list()
    .title('PD-Blog Content')
    .items([
      // A group for all blog-related content
      S.listItem()
        .title('📝 Blog Content')
        .id('blog-content')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('All Posts'),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),

      S.divider(), // A visual separator

      // A group for managing user comments, split into pending and approved
      S.listItem()
        .title('💬 User Comments')
        .id('comments')
        .child(
          S.list()
            .title('Comments')
            .items([
              // A list of comments that need your approval
              S.listItem()
                .title('👀 Pending Approval')
                .schemaType('comment')
                .child(
                  S.documentList()
                    .title('Pending Comments')
                    .filter('_type == "comment" && approved == false')
                ),
              // A list of all approved comments
              S.listItem()
                .title('✅ Approved')
                .schemaType('comment')
                .child(
                  S.documentList()
                    .title('Approved Comments')
                    .filter('_type == "comment" && approved == true')
                ),
            ])
        ),

      S.divider(),

      // The rest of our document types, filtered out so we don't have duplicates
      ...S.documentTypeListItems().filter(
        (listItem) => !['post', 'author', 'comment'].includes(listItem.getId())
      ),
    ]);
