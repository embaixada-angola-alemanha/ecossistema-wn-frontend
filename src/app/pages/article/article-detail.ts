import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ArticleService } from '@core/services/article.service';
import { SeoService } from '@core/services/seo.service';
import { LanguageService } from '@core/services/language.service';
import { Article, ShareLinks } from '@core/models/article.model';
import { LocalizedPipe } from '@shared/pipes/localized.pipe';
import { ImageUrlPipe } from '@shared/pipes/image-url.pipe';
import { ArticleContentPipe } from '@shared/pipes/article-content.pipe';
import { environment } from '@env/environment';

@Component({
  selector: 'wn-article-detail',
  standalone: true,
  imports: [RouterLink, TranslateModule, LocalizedPipe, ImageUrlPipe, ArticleContentPipe, DatePipe],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss'
})
export class ArticleDetail implements OnInit {

  slug = input.required<string>();

  private readonly articleService = inject(ArticleService);
  private readonly seoService = inject(SeoService);
  readonly langService = inject(LanguageService);

  readonly article = signal<Article | null>(null);
  readonly shareLinks = signal<ShareLinks | null>(null);
  readonly relatedArticles = signal<Article[]>([]);

  ngOnInit(): void {
    this.loadArticle();
  }

  private loadArticle(): void {
    this.articleService.getBySlug(this.slug()).subscribe(article => {
      this.article.set(article);

      const title = this.langService.getLocalizedField(article, 'titulo');
      const excerpt = this.langService.getLocalizedField(article, 'excerto');

      this.seoService.updateMeta({
        title,
        description: excerpt,
        keywords: article.metaKeywords || undefined,
        type: 'article',
        url: `${environment.siteUrl}/artigo/${article.slug}`
      });

      this.seoService.setStructuredData(
        this.seoService.getArticleSchema({
          title,
          description: excerpt,
          url: `${environment.siteUrl}/artigo/${article.slug}`,
          author: article.author?.nome,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt
        })
      );

      this.articleService.getShareLinks(article.slug).subscribe(links => {
        this.shareLinks.set(links);
      });

      if (article.category) {
        this.articleService.getByCategory(article.category.id, 0, 4).subscribe(data => {
          this.relatedArticles.set(
            data.content.filter(a => a.id !== article.id).slice(0, 3)
          );
        });
      }
    });
  }
}
