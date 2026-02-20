import { Component, computed, DestroyRef, HostListener, inject, input, isDevMode, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  styleUrl: './article-detail.scss',
  encapsulation: ViewEncapsulation.None
})
export class ArticleDetail implements OnInit {

  slug = input.required<string>();

  private readonly route = inject(ActivatedRoute);
  private readonly articleService = inject(ArticleService);
  private readonly seoService = inject(SeoService);
  readonly langService = inject(LanguageService);

  readonly article = signal<Article | null>(null);
  readonly shareLinks = signal<ShareLinks | null>(null);
  readonly relatedArticles = signal<Article[]>([]);
  readonly isDev = isDevMode();
  readonly debugSentences = signal(false);
  readonly activeHeading = signal('');
  readonly shareOpen = signal(false);
  readonly linkCopied = signal(false);

  private observer: IntersectionObserver | null = null;
  private readonly destroyRef = inject(DestroyRef);

  /** Extract h2/h3 headings from article content for TOC.
   *  Runs the same detection logic as the pipe to stay in sync. */
  readonly headings = computed(() => {
    const art = this.article();
    if (!art) return [];
    const content = this.langService.getLocalizedField(art, 'conteudo') || '';
    const seen = new Set<string>();
    const result: { id: string; text: string; level: number }[] = [];

    const add = (text: string, level: number) => {
      const id = this.slugify(text);
      if (!seen.has(id)) {
        seen.add(id);
        result.push({ id, text, level });
      }
    };

    // Pattern A: quoted bold pseudo-headings
    const quotedRe = /<p[^>]*>\s*<strong>\s*[\u201C\u201D\u201E\u00AB\u00BB""\u2018\u2019'']*\s*([^<\u201C\u201D\u201E\u00AB\u00BB""\u2018\u2019'']{1,60}?)\s*[\u201C\u201D\u201E\u00AB\u00BB""\u2018\u2019'']*\s*<\/strong>\s*<\/p>/gi;
    let m: RegExpExecArray | null;
    while ((m = quotedRe.exec(content)) !== null) {
      add(m[1].trim(), 3);
    }

    // Pattern B: short bold paragraphs (≤6 words, not a question/URL)
    const boldRe = /<p[^>]*>\s*<strong>\s*([^<]{2,50}?)\s*<\/strong>\s*<\/p>/gi;
    while ((m = boldRe.exec(content)) !== null) {
      const t = m[1].trim();
      const words = t.split(/\s+/).length;
      if (t.includes('?') || t.includes('http') || words > 6) continue;
      if (t.endsWith(':') && words > 3) continue;
      add(t, 3);
    }

    // Real headings already in HTML
    const realRe = /<h([23])[^>]*>([^<]+)<\/h\1>/gi;
    while ((m = realRe.exec(content)) !== null) {
      add(m[2].trim(), parseInt(m[1]));
    }

    return result;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) this.loadArticle(slug);
    });

    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  private slugify(text: string): string {
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private setupHeadingObserver(): void {
    this.observer?.disconnect();

    // Wait for DOM to render the new content
    requestAnimationFrame(() => {
      const headingEls = document.querySelectorAll('.article-page__body h2[id], .article-page__body h3[id]');
      if (!headingEls.length) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.activeHeading.set(entry.target.id);
            }
          }
        },
        { rootMargin: '-10% 0px -70% 0px' }
      );

      headingEls.forEach(el => this.observer!.observe(el));
    });
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.shareOpen.set(false);
  }

  onShare(event: Event): void {
    event.stopPropagation();
    const art = this.article();
    if (!art) return;

    const title = this.langService.getLocalizedField(art, 'titulo') || '';
    const url = `${environment.siteUrl}/artigo/${art.slug}`;

    // Try native Web Share API (mobile + some desktop browsers)
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
      return;
    }

    // Fallback: toggle dropdown dialog
    this.shareOpen.update(v => !v);
  }

  copyLink(): void {
    const art = this.article();
    if (!art) return;
    const url = `${environment.siteUrl}/artigo/${art.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2000);
    });
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private loadArticle(slug: string): void {
    this.articleService.getBySlug(slug).subscribe(article => {
      this.article.set(article);
      this.scrollToTop();
      this.setupHeadingObserver();

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
