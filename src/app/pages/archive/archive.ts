import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, LowerCasePipe } from '@angular/common';
import { ArticleService } from '@core/services/article.service';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@core/services/seo.service';
import { Article, Category, Tag } from '@core/models/article.model';
import { LocalizedPipe } from '@shared/pipes/localized.pipe';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'wn-archive',
  standalone: true,
  imports: [RouterLink, TranslateModule, LocalizedPipe, DatePipe, LowerCasePipe],
  templateUrl: './archive.html',
  styleUrl: './archive.scss'
})
export class Archive implements OnInit {

  private readonly articleService = inject(ArticleService);
  private readonly seoService = inject(SeoService);
  readonly langService = inject(LanguageService);

  readonly articles = signal<Article[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly tags = signal<Tag[]>([]);
  readonly selectedCategory = signal<string | null>(null);
  readonly selectedTag = signal<string | null>(null);
  readonly page = signal(0);
  readonly hasMore = signal(true);
  readonly loading = signal(false);
  readonly totalElements = signal(0);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Arquivo de Notícias',
      description: 'Arquivo completo de artigos e notícias da Welwitschia Notícias'
    });

    forkJoin({
      categories: this.articleService.getCategories(),
      tags: this.articleService.getTags()
    }).subscribe(({ categories, tags }) => {
      this.categories.set(categories);
      this.tags.set(tags);
    });

    this.loadArticles();
  }

  loadArticles(): void {
    this.loading.set(true);
    const catId = this.selectedCategory();
    const tagId = this.selectedTag();

    let obs;
    if (catId) {
      obs = this.articleService.getByCategory(catId, this.page(), 12);
    } else if (tagId) {
      obs = this.articleService.getByTag(tagId, this.page(), 12);
    } else {
      obs = this.articleService.getPublished(this.page(), 12);
    }

    obs.subscribe(data => {
      if (this.page() === 0) {
        this.articles.set(data.content);
      } else {
        this.articles.update(prev => [...prev, ...data.content]);
      }
      this.totalElements.set(data.totalElements);
      this.hasMore.set(!data.last);
      this.loading.set(false);
    });
  }

  filterByCategory(categoryId: string | null): void {
    this.selectedCategory.set(categoryId);
    this.selectedTag.set(null);
    this.page.set(0);
    this.loadArticles();
  }

  filterByTag(tagId: string | null): void {
    this.selectedTag.set(tagId);
    this.selectedCategory.set(null);
    this.page.set(0);
    this.loadArticles();
  }

  loadMore(): void {
    this.page.update(p => p + 1);
    this.loadArticles();
  }

  clearFilters(): void {
    this.selectedCategory.set(null);
    this.selectedTag.set(null);
    this.page.set(0);
    this.loadArticles();
  }
}
