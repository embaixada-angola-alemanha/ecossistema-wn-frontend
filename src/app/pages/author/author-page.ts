import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ArticleService } from '@core/services/article.service';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@core/services/seo.service';
import { Article } from '@core/models/article.model';
import { LocalizedPipe } from '@shared/pipes/localized.pipe';

@Component({
  selector: 'wn-author-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, LocalizedPipe, DatePipe],
  template: `
    <div class="author-page">
      <div class="author-page__container">
        <h1 class="author-page__title">{{ 'author.articles_by' | translate }}</h1>

        <div class="article-grid">
          @for (article of articles(); track article.id) {
            <a [routerLink]="['/artigo', article.slug]" class="article-card">
              <div class="article-card__image">
                <div class="article-card__placeholder">
                  <span class="material-icons-outlined">article</span>
                </div>
              </div>
              <div class="article-card__body">
                @if (article.category) {
                  <span class="article-card__category" [style.color]="article.category.cor || 'var(--ember)'">
                    {{ article.category | localized:'nome' }}
                  </span>
                }
                <h3 class="article-card__title">{{ article | localized:'titulo' }}</h3>
                <span class="article-card__date">{{ article.publishedAt | date:'mediumDate' }}</span>
              </div>
            </a>
          }
        </div>

        @if (hasMore() && !loading()) {
          <div class="load-more">
            <button class="btn btn--outline" (click)="loadMore()">{{ 'common.load_more' | translate }}</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .author-page {
      &__container { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
      &__title { font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 2rem; }
    }
  `]
})
export class AuthorPage implements OnInit {

  slug = input.required<string>();

  private readonly articleService = inject(ArticleService);
  private readonly seoService = inject(SeoService);
  readonly langService = inject(LanguageService);

  readonly articles = signal<Article[]>([]);
  readonly page = signal(0);
  readonly hasMore = signal(true);
  readonly loading = signal(false);
  private authorId = '';

  ngOnInit(): void {
    // For now, we load from published articles — author page discovery via slug requires backend endpoint
    this.seoService.updateMeta({ title: 'Autor' });
  }

  loadMore(): void {
    // Placeholder for author article pagination
  }
}
