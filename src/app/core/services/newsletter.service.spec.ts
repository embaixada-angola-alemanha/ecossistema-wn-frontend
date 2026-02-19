import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NewsletterService } from './newsletter.service';

describe('NewsletterService', () => {
  let service: NewsletterService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(NewsletterService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /newsletter/subscribe with email and idioma', () => {
    const subscription = { email: 'test@example.com', idioma: 'pt' };
    const mockResponse = {
      id: '1', email: 'test@example.com', idioma: 'pt',
      activo: true, confirmed: false, createdAt: '2026-01-01',
    };

    service.subscribe(subscription).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(req => req.url.endsWith('/newsletter/subscribe'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(subscription);
    req.flush({ success: true, data: mockResponse });
  });
});
