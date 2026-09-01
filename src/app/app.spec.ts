import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { MsalService } from '@azure/msal-angular';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let mockMsalService: any;

  beforeEach(async () => {
    // 1. Create a mock object matching the MSAL signature used in your component
    mockMsalService = {
      handleRedirectObservable: () => of(null), // Returns a mock Observable
      loginRedirect: () => {}, 
      instance: {
        getAllAccounts: () => [], // <-- This fixes your specific TypeError
        getActiveAccount: () => null,
        setActiveAccount: (account: any) => {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent], // Since AppComponent is standalone
      providers: [
        // 2. Inject the mock instead of the real service
        { provide: MsalService, useValue: mockMsalService }
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