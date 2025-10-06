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
                ),
              S.listItem().title('✅ Approved').schemaType('comment').child(
                S.documentList()
                  .title('Approved Comments')
                  // 3. And add the apiVersion here
                  .apiVersion(apiVersion)
                  .filter('_type == "comment" && approved == true')
              ),
            ])
        ),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !['post', 'author', 'comment'].includes(listItem.getId())
      ),
    ]);
