import { Configuration, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '3c37b98b-69df-4f28-b6f5-03ad9d7ad852',
    authority: 'https://login.microsoftonline.com/66c5be6d-b895-4170-9fe4-1d29253008f0', 
    redirectUri: typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://globallogin-baeecpe6hrhedqan.westus3-01.azurewebsites.net', 
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage
  }
};

export interface TenantConfig {
  id: string;
  name: string;
  appServiceUrl: string;
}

export const TENANTS: TenantConfig[] = [
  {
    id: 'global-tenant',
    name: 'Global Tenant',
    appServiceUrl: 'https://sportapi-f8c3aghnezajanbx.canadacentral-01.azurewebsites.net'
  },
  {
    id: 'child-tenant-b',
    name: 'Tenant B',
    appServiceUrl: 'https://sportapi-dzgqbheja0fadadu.eastasia-01.azurewebsites.net'
  }
];

