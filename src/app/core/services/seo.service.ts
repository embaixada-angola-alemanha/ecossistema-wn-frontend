import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class SeoService {

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  updateMeta(config: {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
  }): void {
    const fullTitle = `${config.title} | ${environment.siteName}`;
    this.title.setTitle(fullTitle);

    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ property: 'og:description', content: config.description });
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: environment.siteName });
    this.meta.updateTag({ name: 'twitter:card', content: config.image ? 'summary_large_image' : 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }
    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
      this.setCanonical(config.url);
    }
  }

  setStructuredData(schema: Record<string, unknown>): void {
    let script = this.doc.getElementById('structured-data') as HTMLScriptElement;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }

  setCanonical(url: string): void {
    let link = this.doc.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  getArticleSchema(article: {
    title: string;
    description: string;
    url: string;
    image?: string;
    author?: string;
    publishedAt?: string;
    updatedAt?: string;
  }): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.description,
      url: article.url,
      image: article.image || undefined,
      author: article.author ? { '@type': 'Person', name: article.author } : undefined,
      publisher: {
        '@type': 'Organization',
        name: environment.siteName,
        url: environment.siteUrl
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt
    };
  }
}
