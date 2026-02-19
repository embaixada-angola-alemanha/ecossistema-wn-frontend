import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ArticleService } from '@core/services/article.service';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@core/services/seo.service';
import { Article } from '@core/models/article.model';
import { LocalizedPipe } from '@shared/pipes/localized.pipe';

@Component({
  selector: 'wn-search-results',
  standalone: true,
  imports: [RouterLink, TranslateModule, LocalizedPipe, DatePipe],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss'
})
export class SearchResults implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly articleService = inject(ArticleService);
  private readonly seoService = inject(SeoService);
  readonly langService = inject(LanguageService);

  readonly query = signal('');
  readonly articles = signal<Article[]>([]);
  readonly page = signal(0);
  readonly hasMore = signal(true);
  readonly loading = signal(false);
  readonly totalElements = signal(0);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'] || '';
      this.query.set(q);
      this.page.set(0);
      this.articles.set([]);

      if (q) {
        this.seoService.updateMeta({ title: `Pesquisa: ${q}` });
        this.searchArticles();
      }
    });
  }

  searchArticles(): void {
    this.loading.set(true);
    this.articleService.search(this.query(), this.page(), 12).subscribe(data => {
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

  loadMore(): void {
    this.page.update(p => p + 1);
    this.searchArticles();
  }
}
