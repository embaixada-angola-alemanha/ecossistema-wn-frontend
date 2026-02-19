import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpTesting: HttpTestingController;

  const flushPaged = (req: ReturnType<HttpTestingController['expectOne']>) => {
    req.flush({
      success: true,
      data: { content: [], totalElements: 0, totalPages: 0, size: 12, number: 0, first: true, last: true },
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ArticleService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /articles with pagination for getPublished', () => {
    service.getPublished(0, 12).subscribe();
    const req = httpTesting.expectOne(req => req.url.endsWith('/articles'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('12');
    flushPaged(req);
  });

  it('should call GET /articles/{slug} for getBySlug', () => {
    service.getBySlug('test-article').subscribe();
    const req = httpTesting.expectOne(req => req.url.endsWith('/articles/test-article'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: { id: '1', slug: 'test-article' } });
  });

  it('should call GET /articles/featured for getFeatured', () => {
    service.getFeatured().subscribe();
    const req = httpTesting.expectOne(req => req.url.endsWith('/articles/featured'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [] });
  });

  it('should call GET /articles/category/{id} for getByCategory', () => {
    service.getByCategory('cat-1').subscribe();
    const req = httpTesting.expectOne(req => req.url.endsWith('/articles/category/cat-1'));
    expect(req.request.method).toBe('GET');
    flushPaged(req);
  });

  it('should call GET /articles/search with query param for search', () => {
    service.search('angola').subscribe();
    const req = httpTesting.expectOne(req => req.url.endsWith('/articles/search'));
    expect(req.request.params.get('q')).toBe('angola');
    flushPaged(req);
  });
});
