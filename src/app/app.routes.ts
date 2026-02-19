import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    data: { title: 'home.title' }
  },
  {
    path: 'artigo/:slug',
    loadComponent: () => import('./pages/article/article-detail').then(m => m.ArticleDetail),
    data: { title: 'article.title' }
  },
  {
    path: 'categoria/:slug',
    loadComponent: () => import('./pages/category/category-page').then(m => m.CategoryPage),
    data: { title: 'category.title' }
  },
  {
    path: 'tag/:slug',
    loadComponent: () => import('./pages/tag/tag-page').then(m => m.TagPage),
    data: { title: 'tag.title' }
  },
  {
    path: 'autor/:slug',
    loadComponent: () => import('./pages/author/author-page').then(m => m.AuthorPage),
    data: { title: 'author.title' }
  },
  {
    path: 'arquivo',
    loadComponent: () => import('./pages/archive/archive').then(m => m.Archive),
    data: { title: 'archive.title' }
  },
  {
    path: 'pesquisa',
    loadComponent: () => import('./pages/search/search-results').then(m => m.SearchResults),
    data: { title: 'search.title' }
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
    data: { title: 'not_found.title' }
  }
];
