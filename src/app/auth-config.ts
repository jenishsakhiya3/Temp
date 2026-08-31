import { Configuration, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '3a221580-7548-4dfa-bb1d-15ff38c6982a', // Replace with your App Registration Client ID
    authority: 'https://login.microsoftonline.com/66c5be6d-b895-4170-9fe4-1d29253008f0', // Replace with Global Tenant ID
    redirectUri: 'http://localhost:4200', // Update this to your production URL later
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage
  }
};