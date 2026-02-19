import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NewsletterService } from '@core/services/newsletter.service';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'wn-newsletter-signup',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './newsletter-signup.html',
  styleUrl: './newsletter-signup.scss'
})
export class NewsletterSignup {

  private readonly newsletterService = inject(NewsletterService);
  private readonly langService = inject(LanguageService);

  readonly email = signal('');
  readonly status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  subscribe(): void {
    const emailVal = this.email().trim();
    if (!emailVal) return;

    this.status.set('loading');
    this.newsletterService.subscribe({
      email: emailVal,
      idioma: this.langService.currentLang()
    }).subscribe({
      next: () => {
        this.status.set('success');
        this.email.set('');
      },
      error: () => {
        this.status.set('error');
      }
    });
  }
}
