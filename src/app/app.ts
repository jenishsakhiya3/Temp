import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { TENANTS, TenantConfig } from './auth-config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f3f4f6; padding: 20px; box-sizing: border-box;">
      
      <!-- Show when user is NOT logged in -->
      <ng-container *ngIf="!isLoggedIn">
        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); padding: 40px 32px; max-width: 420px; width: 100%; text-align: center; box-sizing: border-box;">
          <h2 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 8px 0;">Global Portal</h2>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 28px 0;">Please sign in to access your applications.</p>
          
          <button 
            (click)="login()" 
            style="display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 12px 24px; font-size: 15px; font-weight: 600; cursor: pointer; border-radius: 8px; border: 1px solid #0078d4; background-color: #0078d4; color: white; box-shadow: 0 2px 4px rgba(0, 120, 212, 0.25); transition: background-color 0.2s;">
            <svg width="18" height="18" viewBox="0 0 21 21" fill="none" style="margin-right: 10px;">
              <path d="M1 1H10V10H1V1Z" fill="#F25022"/>
              <path d="M11 1H20V10H11V1Z" fill="#7FBA00"/>
              <path d="M1 11H10V20H1V11Z" fill="#00A4EF"/>
              <path d="M11 11H20V20H11V11Z" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
          </button>
        </div>
      </ng-container>

      <!-- Show when user IS logged in -->
      <ng-container *ngIf="isLoggedIn">
        <div style="background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); padding: 32px; max-width: 520px; width: 100%; box-sizing: border-box;">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;">
            <div>
              <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 4px 0;">Welcome<span *ngIf="userName">, {{ userName }}</span></h2>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">Select an application to launch</p>
            </div>
            <button 
              (click)="logout()" 
              [disabled]="isRedirecting"
              style="padding: 6px 14px; font-size: 13px; font-weight: 500; cursor: pointer; border-radius: 6px; border: 1px solid #d1d5db; background-color: #f9fafb; color: #374151; transition: all 0.2s;">
              Sign out
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div 
              *ngFor="let tenant of tenants" 
              (click)="!isRedirecting && redirectToApp(tenant)"
              [style.opacity]="isRedirecting ? 0.6 : 1"
              [style.cursor]="isRedirecting ? 'not-allowed' : 'pointer'"
              style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border: 1px solid #e5e7eb; border-radius: 10px; transition: all 0.2s; background: #fafafa;"
              onmouseover="if (!this.style.cursor.includes('not-allowed')) { this.style.borderColor='#0078d4'; this.style.backgroundColor='#f0f7ff'; }"
              onmouseout="if (!this.style.cursor.includes('not-allowed')) { this.style.borderColor='#e5e7eb'; this.style.backgroundColor='#fafafa'; }">
              
              <div style="display: flex; flex-direction: column; gap: 4px; overflow: hidden; margin-right: 12px;">
                <span style="font-size: 16px; font-weight: 600; color: #1f2937;">{{ tenant.name }}</span>
                <span style="font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">{{ tenant.appServiceUrl }}</span>
              </div>
              
              <button 
                (click)="redirectToApp(tenant); $event.stopPropagation()" 
                [disabled]="isRedirecting"
                style="padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 6px; border: none; background-color: #0078d4; color: white; white-space: nowrap; flex-shrink: 0; min-width: 90px;">
                <span *ngIf="redirectingTenantId === tenant.id">Opening...</span>
                <span *ngIf="redirectingTenantId !== tenant.id">Launch &rarr;</span>
              </button>
            </div>
          </div>

        </div>
      </ng-container>

    </div>
  `
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  isRedirecting = false;
  redirectingTenantId = '';
  tenants: TenantConfig[] = TENANTS;

  constructor(
    private msalService: MsalService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.updateLoginStatus();

    this.msalService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result && result.account) {
          this.msalService.instance.setActiveAccount(result.account);
        }
        this.updateLoginStatus();
      },
      error: (error) => {
        console.error('Authentication Error:', error);
        this.updateLoginStatus();
      }
    });
  }

  private updateLoginStatus(): void {
    this.ngZone.run(() => {
      const activeAccount = this.msalService.instance.getActiveAccount();
      if (!activeAccount) {
        const accounts = this.msalService.instance.getAllAccounts();
        if (accounts.length > 0) {
          this.msalService.instance.setActiveAccount(accounts[0]);
        }
      }

      const currentAccount = this.msalService.instance.getActiveAccount();
      this.isLoggedIn = !!currentAccount;
      this.userName = currentAccount?.name || currentAccount?.username || '';
      this.cdr.detectChanges();
    });
  }

  login(): void {
    this.msalService.loginRedirect({
      scopes: ['User.Read']
    });
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }

  async redirectToApp(tenant: TenantConfig): Promise<void> {
    const activeAccount = this.msalService.instance.getActiveAccount();
    if (!activeAccount) {
      this.login();
      return;
    }

    this.isRedirecting = true;
    this.redirectingTenantId = tenant.id;
    this.cdr.detectChanges();

    let idToken = activeAccount.idToken || '';
    let accessToken = '';

    const tokenRequest = {
      scopes: ['User.Read'],
      account: activeAccount
    };

    try {
      // 1. Attempt silent token acquisition
      const tokenResponse = await this.msalService.instance.acquireTokenSilent(tokenRequest);
      accessToken = tokenResponse.accessToken || '';
      idToken = tokenResponse.idToken || idToken;
      console.log('Successfully acquired Access Token silently:', accessToken ? 'YES (Length: ' + accessToken.length + ')' : 'NO');
    } catch (silentError) {
      console.warn('acquireTokenSilent failed:', silentError);

      try {
        // 2. Fallback to popup if silent acquisition fails (e.g. consent or interaction required)
        const popupResponse = await this.msalService.instance.acquireTokenPopup(tokenRequest);
        accessToken = popupResponse.accessToken || '';
        idToken = popupResponse.idToken || idToken;
        console.log('Successfully acquired Access Token via Popup:', accessToken ? 'YES' : 'NO');
      } catch (popupError) {
        console.error('acquireTokenPopup also failed:', popupError);
      }
    }

    const tokenPayload = accessToken || idToken;
    const userEmail = activeAccount.username || '';

    console.log('Final Access Token:', accessToken);
    console.log('Final ID Token:', idToken);

    // Construct URL hash fragment (standard OAuth/OIDC transfer)
    const hashParams = new URLSearchParams();
    if (idToken) hashParams.set('id_token', idToken);
    if (accessToken) hashParams.set('access_token', accessToken);
    if (tokenPayload) hashParams.set('token', tokenPayload);
    if (userEmail) hashParams.set('user', userEmail);

    const separator = tenant.appServiceUrl.includes('#') ? '&' : '#';
    const redirectUrl = `${tenant.appServiceUrl}${separator}${hashParams.toString()}`;

    window.location.href = redirectUrl;
  }
}