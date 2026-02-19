import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Home } from './home';

describe('Home (WN)', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    })
      .overrideComponent(Home, {
        set: { template: '<div>wn home works</div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize featured signal as empty array', () => {
    expect(component.featured()).toEqual([]);
  });

  it('should initialize latest signal as empty array', () => {
    expect(component.latest()).toEqual([]);
  });

  it('should initialize categories signal as empty array', () => {
    expect(component.categories()).toEqual([]);
  });
});
