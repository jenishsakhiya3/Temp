import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { of } from 'rxjs';
import { TENANTS } from './auth-config';

describe('AppComponent', () => {
  let mockMsalService: any;
  let mockMsalBroadcastService: any;

  beforeEach(async () => {
    mockMsalService = {
      handleRedirectObservable: () => of(null),
      loginPopup: () => of(null),
      loginRedirect: () => of(undefined),
      logoutPopup: () => of(undefined),
      logoutRedirect: () => of(undefined),
      instance: {
        getAllAccounts: () => [],
        getActiveAccount: () => null,
        setActiveAccount: (_account: any) => {}
      }
    };

    mockMsalBroadcastService = {
      inProgress$: of(InteractionStatus.None),
      msalSubject$: of()
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: MsalService, useValue: mockMsalService },
        { provide: MsalBroadcastService, useValue: mockMsalBroadcastService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
    expect(app.isLoggedIn).toBe(false);
  });

  it('should detect logged in user if active account is present', () => {
    const mockAccount = { name: 'John Doe', username: 'john@example.com' };
    mockMsalService.instance.getAllAccounts = () => [mockAccount];
    mockMsalService.instance.getActiveAccount = () => mockAccount;

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    expect(app.isLoggedIn).toBe(true);
    expect(app.userName).toBe('John Doe');
  });

  it('should call loginRedirect when login is triggered', () => {
    const loginSpy = vi.spyOn(mockMsalService, 'loginRedirect');
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.login();
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should call logoutRedirect when logout is triggered', () => {
    const logoutSpy = vi.spyOn(mockMsalService, 'logoutRedirect');
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.logout();
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should have 2 tenant applications listed', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.tenants.length).toBe(2);
    expect(app.tenants).toEqual(TENANTS);
  });
});