import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';
import { LanguageService, LANGUAGES } from '@core/services/language.service';
import { ArticleService } from '@core/services/article.service';
import { Category } from '@core/models/article.model';

@Component({
  selector: 'wn-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, TranslateModule, UpperCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  readonly langService = inject(LanguageService);
  private readonly articleService = inject(ArticleService);
  readonly languages = LANGUAGES;
  readonly categories = signal<Category[]>([]);
  readonly menuOpen = signal(false);
  readonly searchQuery = signal('');

  constructor() {
    this.articleService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  today(): string {
    return new Date().toLocaleDateString(this.langService.currentLang(), {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
