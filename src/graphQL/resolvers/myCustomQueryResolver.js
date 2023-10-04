export const getMyPosts = (GraphQL, payload) => {
  return {
    args: {},
    resolve: Resolver,
    // The name of your new type has to be unique
    type: buildPaginatedListType('AuthorPosts', payload.collections['vendors'].graphQL?.type),
  }
}