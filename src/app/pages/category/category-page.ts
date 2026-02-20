import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ArticleService } from '@core/services/article.service';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@core/services/seo.service';
import { Article, Category } from '@core/models/article.model';
import { LocalizedPipe } from '@shared/pipes/localized.pipe';
import { ImageUrlPipe } from '@shared/pipes/image-url.pipe';

@Component({
  selector: 'wn-category-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, LocalizedPipe, ImageUrlPipe, DatePipe],
  templateUrl: './category-page.html',
  styleUrl: './category-page.scss'
})
export class CategoryPage implements OnInit {

  slug = input.required<string>();

  private readonly articleService = inject(ArticleService);
  private readonly seoService = inject(SeoService);
  readonly langService = inject(LanguageService);

  readonly category = signal<Category | null>(null);
  readonly articles = signal<Article[]>([]);
  readonly page = signal(0);
  readonly hasMore = signal(true);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.articleService.getCategories().subscribe(cats => {
      const cat = cats.find(c => c.slug === this.slug());
      if (cat) {
        this.category.set(cat);
        this.seoService.updateMeta({
          title: this.langService.getLocalizedField(cat, 'nome')
        });
        this.loadArticles(cat.id);
      }
    });
  }

  loadArticles(categoryId: string): void {
    this.loading.set(true);
    this.articleService.getByCategory(categoryId, this.page(), 12).subscribe(data => {
      this.articles.update(prev => [...prev, ...data.content]);
      this.hasMore.set(!data.last);
      this.loading.set(false);
    });
  }

  loadMore(): void {
    if (this.category()) {
      this.page.update(p => p + 1);
      this.loadArticles(this.category()!.id);
    }
  }
}
