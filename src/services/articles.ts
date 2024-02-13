import { isPDF } from "@/mixins/File";
import { Article } from "@/modules/article/types";
import { axiosInstance } from "@/plugins/axios";

export async function saveArticle(article: Article) {
  if (article.format) {
    isPDF(article.format);
  }
  await axiosInstance.post('/articles', article);
}

export async function getArticles() {
  const response = await axiosInstance.get('/articles');
  return response.data;
}
export async function getArticle(id: string) {
  const response = await axiosInstance.get(`/articles/${id}`);
  return response.data;
}
export async function deleteArticle(id: string) {
  await axiosInstance.delete(`/articles/${id}`);
}

export async function updateArticle(id: string, article: Article) {
  const response = await axiosInstance.put(`/articles/${id}`, article);
  return response.data;
}
