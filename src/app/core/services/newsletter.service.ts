import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NewsletterSubscription, NewsletterResponse } from '../models/newsletter.model';

@Injectable({ providedIn: 'root' })
export class NewsletterService {

  private readonly api = inject(ApiService);

  subscribe(data: NewsletterSubscription): Observable<NewsletterResponse> {
    return this.api.post<NewsletterResponse>('/newsletter/subscribe', data);
  }
}
