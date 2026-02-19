import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, LANGUAGES } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a currentLang signal with a default value', () => {
    expect(service.currentLang()).toBeTruthy();
  });

  it('should expose supported LANGUAGES', () => {
    expect(LANGUAGES.length).toBe(3);
    expect(LANGUAGES.map(l => l.code)).toEqual(['pt', 'en', 'de']);
  });

  it('should update currentLang when setLang is called', () => {
    service.setLang('en');
    expect(service.currentLang()).toBe('en');
  });

  it('should return localized field with correct suffix', () => {
    const obj = { tituloPt: 'Titulo PT', tituloEn: 'Title EN', tituloDe: 'Titel DE' };
    service.setLang('en');
    expect(service.getLocalizedField(obj, 'titulo')).toBe('Title EN');
    service.setLang('pt');
    expect(service.getLocalizedField(obj, 'titulo')).toBe('Titulo PT');
  });
});
