export interface ArticleState {
  article: Article
}
export interface Article {
  name: string,
  uid: string,
  serial?: string,
  id?: string,
  date: string,
  format: string,
}