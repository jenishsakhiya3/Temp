import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { MsalService } from '@azure/msal-angular';
import { of } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    const msalServiceMock = {
      instance: {
        getActiveAccount: () => null,
        setActiveAccount: () => {}
      },
      handleRedirectObservable: () => of(null),
      loginRedirect: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: MsalService, useValue: msalServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Global Portal');
  });
});