import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedPipe } from './localized.pipe';
import { LanguageService } from '@core/services/language.service';

describe('LocalizedPipe', () => {
  let pipe: LocalizedPipe;
  let langService: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [LocalizedPipe],
    });
    pipe = TestBed.inject(LocalizedPipe);
    langService = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null input', () => {
    expect(pipe.transform(null, 'titulo')).toBe('');
  });

  it('should return localized field based on current language', () => {
    const obj = { tituloPt: 'Titulo PT', tituloEn: 'Title EN' };
    langService.setLang('en');
    expect(pipe.transform(obj, 'titulo')).toBe('Title EN');
  });

  it('should fallback to Pt when current lang field is missing', () => {
    const obj = { tituloPt: 'Titulo PT' };
    langService.setLang('de');
    expect(pipe.transform(obj, 'titulo')).toBe('Titulo PT');
  });
});
