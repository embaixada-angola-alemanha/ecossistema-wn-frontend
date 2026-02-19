import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NewsletterSignup } from './newsletter-signup';

describe('NewsletterSignup', () => {
  let component: NewsletterSignup;
  let fixture: ComponentFixture<NewsletterSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterSignup, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideComponent(NewsletterSignup, {
        set: { template: '<div>newsletter signup works</div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewsletterSignup);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize email signal as empty string', () => {
    expect(component.email()).toBe('');
  });

  it('should initialize status signal as idle', () => {
    expect(component.status()).toBe('idle');
  });

  it('should not subscribe when email is empty', () => {
    component.subscribe();
    expect(component.status()).toBe('idle');
  });
});
