import { Configuration, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'bd9afa2d-f5d5-4e67-9bc2-47e435146733',
    authority: 'https://login.microsoftonline.com/db85f625-db9c-40ca-9289-4dbbaa596f22', 
    redirectUri: typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://globallogin-baeecpe6hrhedqan.centralindia-01.azurewebsites.net', 
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage
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
    name: 'Region1',
    appServiceUrl: 'https://fe1-hharfzf5b6dve0dw.eastasia-01.azurewebsites.net'
  },
  {
    id: 'child-tenant-b',
    name: 'Region2',
    appServiceUrl: 'https://fe2-ayc4cye2bpg7gqb5.eastasia-01.azurewebsites.net'
  }
];

