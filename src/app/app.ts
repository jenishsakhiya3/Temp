import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; margin-top: 100px;">
      
      <!-- Show when user is NOT logged in -->
      <ng-container *ngIf="!isLoggedIn">
        <h2>Global Portal</h2>
        <button (click)="login()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
          Sign in with Microsoft
        </button>
      </ng-container>

      <!-- Show when user IS logged in -->
      <ng-container *ngIf="isLoggedIn">
        <h2>Select Destination Environment</h2>
        
        <select [(ngModel)]="selectedTenantUrl" style="padding: 10px; font-size: 16px; margin-bottom: 20px; width: 300px;">
          <option value="" disabled>-- Select Tenant --</option>
          <option *ngFor="let t of tenants" [value]="t.appServiceUrl">{{ t.name }}</option>
        </select>
        
        <button (click)="goToTenant()" [disabled]="!selectedTenantUrl" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
          Go to App Service
        </button>
      </ng-container>

    </div>
  `
})

export class AppComponent implements OnInit {
  isLoggedIn = false;
  selectedTenantUrl = '';

  tenants = [
    { name: 'Global Tenant', appServiceUrl: 'https://sportapi-f8c3aghnezajanbx.canadacentral-01.azurewebsites.net' },
    { name: 'Tenant B', appServiceUrl: 'https://sportapi-dzgqbheja0fadadu.eastasia-01.azurewebsites.net' }
  ];

  // Inject the MsalBroadcastService alongside MsalService
  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    // 1. Still handle the redirect observable to process the raw token
    this.msalService.handleRedirectObservable().subscribe();

    // 2. Wait for MSAL to be completely idle before checking account status
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
      });
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      let accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
      activeAccount = this.msalService.instance.getActiveAccount();
    }

    // This will now correctly evaluate to true after the token is processed
    this.isLoggedIn = !!activeAccount;
  }

  login() {
    this.msalService.loginRedirect();
  }

  goToTenant() {
    if (this.selectedTenantUrl) {
      window.location.href = this.selectedTenantUrl;
    }
  }
}