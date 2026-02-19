import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';

export interface Language {
  code: string;
  label: string;
}

export const LANGUAGES: Language[] = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' }
];

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private readonly translate = inject(TranslateService);
  readonly currentLang = signal(environment.defaultLang);

  init(): void {
    const stored = localStorage.getItem('wn-lang');
    const browserLang = this.translate.getBrowserLang();
    const lang = stored
      || (browserLang && environment.supportedLangs.includes(browserLang) ? browserLang : null)
      || environment.defaultLang;
    this.setLang(lang);
  }

  setLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('wn-lang', lang);
    document.documentElement.lang = lang;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLocalizedField(obj: any, fieldBase: string): string {
    const lang = this.currentLang();
    const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
    const key = fieldBase + suffix;
    return (obj[key] as string) || (obj[fieldBase + 'Pt'] as string) || '';
  }
}
