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
    appServiceUrl: 'https://frontend1-cufvf6fjc0epchf0.eastasia-01.azurewebsites.net'
  },
  {
    id: 'child-tenant-b',
    name: 'Region2',
    appServiceUrl: 'https://frontend2-bpf8dqb4hvhkhhae.eastasia-01.azurewebsites.net'
  }
];

