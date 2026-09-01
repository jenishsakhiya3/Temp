import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockMsalService: any;
  let mockMsalBroadcastService: any;

  beforeEach(async () => {
    mockMsalService = {
      handleRedirectObservable: () => of(null),
      loginRedirect: () => {}, 
      instance: {
        getAllAccounts: () => [], 
        getActiveAccount: () => null,
        setActiveAccount: (account: any) => {}
      }
    };

    mockMsalBroadcastService = {
      inProgress$: of(InteractionStatus.None)
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
  });
});