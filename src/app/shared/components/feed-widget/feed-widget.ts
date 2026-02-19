import { Component, inject, OnInit, signal, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ArticleService } from '@core/services/article.service';
import { LanguageService } from '@core/services/language.service';
import { Article } from '@core/models/article.model';
import { LocalizedPipe } from '@shared/pipes/localized.pipe';

@Component({
  selector: 'wn-feed-widget',
  standalone: true,
  imports: [RouterLink, DatePipe, LocalizedPipe],
  template: `
    <aside class="feed-widget">
      <h3 class="feed-widget__title">{{ title() }}</h3>
      <div class="feed-widget__list">
        @for (article of articles(); track article.id) {
          <a [routerLink]="['/artigo', article.slug]" class="feed-widget__item">
            <span class="feed-widget__item-title">{{ article | localized:'titulo' }}</span>
            <time class="feed-widget__item-date">{{ article.publishedAt | date:'shortDate' }}</time>
          </a>
        }
      </div>
      @if (articles().length > 0) {
        <a routerLink="/arquivo" class="feed-widget__more">Ver mais &rarr;</a>
      }
    </aside>
  `,
  styles: [`
    .feed-widget {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 1.25rem;
      font-family: var(--font-sans);

      &__title {
        font-family: var(--font-heading);
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--ember);
      }

      &__list { display: flex; flex-direction: column; }

      &__item {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 0.5rem;
        padding: 0.6rem 0;
        border-bottom: 1px solid var(--border);
        text-decoration: none;
        color: var(--text-primary);
        &:last-child { border-bottom: none; }
        &:hover { color: var(--ember); }
      }

      &__item-title {
        font-size: 0.85rem;
        line-height: 1.3;
        flex: 1;
      }

      &__item-date {
        font-size: 0.7rem;
        color: var(--text-muted);
        white-space: nowrap;
      }

      &__more {
        display: block;
        text-align: right;
        margin-top: 0.75rem;
        font-size: 0.8rem;
        color: var(--ember);
        text-decoration: none;
        font-weight: 500;
        &:hover { text-decoration: underline; }
      }
    }
  `]
})
export class FeedWidget implements OnInit {

  title = input('Últimas Notícias');
  count = input(5);

  private readonly articleService = inject(ArticleService);
  readonly langService = inject(LanguageService);
  readonly articles = signal<Article[]>([]);

  ngOnInit(): void {
    this.articleService.getPublished(0, this.count()).subscribe(data => {
      this.articles.set(data.content);
    });
  }
}
