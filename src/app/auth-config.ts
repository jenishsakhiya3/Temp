import { Configuration, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'd522c963-0949-4a42-8e51-592893f27a1a',
    authority: 'https://login.microsoftonline.com/66c5be6d-b895-4170-9fe4-1d29253008f0',
    redirectUri: typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://globallogin-baeecpe6hrhedqan.canadacentral-01.azurewebsites.net',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
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
