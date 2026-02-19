import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'wn-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <div class="not-found">
      <span class="not-found__code">404</span>
      <h1 class="not-found__title">{{ 'not_found.title' | translate }}</h1>
      <p class="not-found__text">{{ 'not_found.text' | translate }}</p>
      <a routerLink="/" class="btn btn--ember">{{ 'not_found.back' | translate }}</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 6rem 1.5rem;
      &__code {
        font-family: var(--font-masthead);
        font-size: 6rem;
        color: var(--ember);
        opacity: 0.3;
        display: block;
      }
      &__title {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        margin: 1rem 0 0.5rem;
      }
      &__text {
        font-family: var(--font-sans);
        color: var(--text-muted);
        margin-bottom: 2rem;
      }
    }
    .btn--ember {
      display: inline-block;
      background: var(--ember);
      color: white;
      padding: 0.6rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-family: var(--font-sans);
      font-weight: 500;
      &:hover { opacity: 0.9; }
    }
  `]
})
export class NotFound {}
