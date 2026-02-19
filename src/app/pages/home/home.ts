import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ArticleService } from '@core/services/article.service';
import { SeoService } from '@core/services/seo.service';
import { LanguageService } from '@core/services/language.service';
import { Article, Category } from '@core/models/article.model';
import { LocalizedPipe } from '@shared/pipes/localized.pipe';
import { NewsletterSignup } from '@shared/components/newsletter-signup/newsletter-signup';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'wn-home',
  standalone: true,
  imports: [RouterLink, TranslateModule, LocalizedPipe, DatePipe, NewsletterSignup],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  private readonly articleService = inject(ArticleService);
  private readonly seoService = inject(SeoService);
  readonly langService = inject(LanguageService);

  readonly featured = signal<Article[]>([]);
  readonly latest = signal<Article[]>([]);
  readonly categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Welwitschia Notícias',
      description: 'Portal de notícias da Embaixada da República de Angola na Alemanha'
    });

    forkJoin({
      featured: this.articleService.getFeatured(),
      latest: this.articleService.getPublished(0, 9),
      categories: this.articleService.getCategories()
    }).subscribe(({ featured, latest, categories }) => {
      this.featured.set(featured);
      this.latest.set(latest.content);
      this.categories.set(categories);
    });
  }
}
