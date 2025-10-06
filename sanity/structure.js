import { apiVersion } from './env';

export const structure = (S) =>
  S.list()
    .title('PD-Blog Content')
    .items([
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

      S.listItem()
        .title('📂 Categories')
        .id('categories')
        .child(S.documentTypeList('category').title('All Categories')),

      S.divider(),

      S.listItem()
        .title('💬 User Comments')
        .id('comments')
        .child(
          S.list()
            .title('Comments')
            .items([
              S.listItem()
                .title('👀 Pending Approval')
                .schemaType('comment')
                .child(
                  S.documentList()
                    .title('Pending Comments')
                    .apiVersion(apiVersion)
                    .filter('_type == "comment" && approved == false')
                    .order('_createdAt desc')
                ),
              S.listItem()
                .title('✅ Approved')
                .schemaType('comment')
                .child(
                  S.documentList()
                    .title('Approved Comments')
                    .apiVersion(apiVersion)
                    .filter('_type == "comment" && approved == true')
                    .order('_createdAt desc')
                ),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('⚙️ Settings')
        .id('settings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),

      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['post', 'author', 'comment', 'category', 'siteSettings'].includes(
            listItem.getId()
          )
      ),
    ]);
