import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';

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

  // Define the target .NET App Service URLs for your tenants
  tenants = [
    { name: 'Global Tenant', appServiceUrl: 'https://sportapi-f8c3aghnezajanbx.canadacentral-01.azurewebsites.net' },
    { name: 'Tenant B', appServiceUrl: 'https://sportapi-dzgqbheja0fadadu.eastasia-01.azurewebsites.net' }
  ];

  constructor(private msalService: MsalService) {}

  ngOnInit(): void {
    this.msalService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result && result.account) {
          this.msalService.instance.setActiveAccount(result.account);
        }

        const accounts = this.msalService.instance.getAllAccounts();
        if (!this.msalService.instance.getActiveAccount() && accounts.length > 0) {
          this.msalService.instance.setActiveAccount(accounts[0]);
        }

        this.isLoggedIn = accounts.length > 0 || !!this.msalService.instance.getActiveAccount();
      },
      error: (error) => console.error('Authentication Error:', error)
    });
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