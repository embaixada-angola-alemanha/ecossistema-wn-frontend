import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '@core/services/language.service';

@Pipe({ name: 'localized', standalone: true, pure: false })
export class LocalizedPipe implements PipeTransform {

  private readonly langService = inject(LanguageService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(obj: any, fieldBase: string): string {
    if (!obj) return '';
    return this.langService.getLocalizedField(obj, fieldBase);
  }
}
