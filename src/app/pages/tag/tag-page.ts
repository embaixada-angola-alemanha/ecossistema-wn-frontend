import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ArticleService } from '@core/services/article.service';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@core/services/seo.service';
import { Article, Tag } from '@core/models/article.model';
import { LocalizedPipe } from '@shared/pipes/localized.pipe';

@Component({
  selector: 'wn-tag-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, LocalizedPipe, DatePipe],
  templateUrl: './tag-page.html',
  styleUrl: './tag-page.scss'
})
export class TagPage implements OnInit {

  slug = input.required<string>();

  private readonly articleService = inject(ArticleService);
  private readonly seoService = inject(SeoService);
  readonly langService = inject(LanguageService);

  readonly tag = signal<Tag | null>(null);
  readonly articles = signal<Article[]>([]);
  readonly page = signal(0);
  readonly hasMore = signal(true);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.articleService.getTags().subscribe(tags => {
      const tag = tags.find(t => t.slug === this.slug());
      if (tag) {
        this.tag.set(tag);
        this.seoService.updateMeta({
          title: this.langService.getLocalizedField(tag, 'nome')
        });
        this.loadArticles(tag.id);
      }
    });
  }

  loadArticles(tagId: string): void {
    this.loading.set(true);
    this.articleService.getByTag(tagId, this.page(), 12).subscribe(data => {
      this.articles.update(prev => [...prev, ...data.content]);
      this.hasMore.set(!data.last);
      this.loading.set(false);
    });
  }

  loadMore(): void {
    if (this.tag()) {
      this.page.update(p => p + 1);
      this.loadArticles(this.tag()!.id);
    }
  }
}
