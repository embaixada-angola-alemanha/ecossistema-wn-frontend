import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { LanguageService } from '@core/services/language.service';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';

@Component({
  selector: 'wn-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  template: `
    <wn-header />
    <main class="main-content">
      <router-outlet />
    </main>
    <wn-footer />
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 200px);
    }
  `]
})
export class App implements OnInit {

  private readonly langService = inject(LanguageService);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.langService.init();
    this.seoService.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      name: environment.siteName,
      url: environment.siteUrl,
      publisher: {
        '@type': 'Organization',
        name: 'Embaixada da República de Angola na Alemanha'
      }
    });
  }
}
