import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Footer } from './footer';

describe('Footer (WN)', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
      ],
    })
      .overrideComponent(Footer, {
        set: { template: '<div>footer works</div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have currentYear set to the current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });
});
