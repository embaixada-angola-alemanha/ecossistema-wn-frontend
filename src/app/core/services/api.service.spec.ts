import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request and extract data from ApiResponse', () => {
    const mockData = { id: '1', title: 'Test' };
    service.get('/test').subscribe(result => {
      expect(result).toEqual(mockData);
    });

    const req = httpTesting.expectOne(req => req.url.endsWith('/test'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockData });
  });

  it('should append query params to GET request', () => {
    service.get('/test', { page: 0, size: 10 }).subscribe();

    const req = httpTesting.expectOne(req => req.url.endsWith('/test'));
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    req.flush({ success: true, data: [] });
  });

  it('should make POST request and extract data from ApiResponse', () => {
    const body = { email: 'test@test.com' };
    const mockResponse = { id: '1', email: 'test@test.com' };

    service.post('/subscribe', body).subscribe(result => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(req => req.url.endsWith('/subscribe'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ success: true, data: mockResponse });
  });

  it('should call get for getPaged and return PagedData', () => {
    const mockPaged = { content: [], totalElements: 0, totalPages: 0, size: 10, number: 0, first: true, last: true };
    service.getPaged('/articles', { page: 0, size: 10 }).subscribe(result => {
      expect(result).toEqual(mockPaged);
    });

    const req = httpTesting.expectOne(req => req.url.endsWith('/articles'));
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockPaged });
  });
});
