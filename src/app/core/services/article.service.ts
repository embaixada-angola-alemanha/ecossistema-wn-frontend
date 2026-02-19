import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Article, Category, Tag, ShareLinks } from '../models/article.model';
import { PagedData } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {

  private readonly api = inject(ApiService);

  getPublished(page = 0, size = 12): Observable<PagedData<Article>> {
    return this.api.getPaged<Article>('/articles', { page, size });
  }

  getBySlug(slug: string): Observable<Article> {
    return this.api.get<Article>(`/articles/${slug}`);
  }

  getFeatured(): Observable<Article[]> {
    return this.api.get<Article[]>('/articles/featured');
  }

  getByCategory(categoryId: string, page = 0, size = 12): Observable<PagedData<Article>> {
    return this.api.getPaged<Article>(`/articles/category/${categoryId}`, { page, size });
  }

  getByTag(tagId: string, page = 0, size = 12): Observable<PagedData<Article>> {
    return this.api.getPaged<Article>(`/articles/tag/${tagId}`, { page, size });
  }

  getByAuthor(authorId: string, page = 0, size = 12): Observable<PagedData<Article>> {
    return this.api.getPaged<Article>(`/articles/author/${authorId}`, { page, size });
  }

  search(query: string, page = 0, size = 12): Observable<PagedData<Article>> {
    return this.api.getPaged<Article>('/articles/search', { q: query, page, size });
  }

  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>('/articles/categories');
  }

  getTags(): Observable<Tag[]> {
    return this.api.get<Tag[]>('/articles/tags');
  }

  getShareLinks(slug: string): Observable<ShareLinks> {
    return this.api.get<ShareLinks>(`/articles/${slug}/share`);
  }
}
