import { Configuration, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '3a221580-7548-4dfa-bb1d-15ff38c6982a',
    authority: 'https://login.microsoftonline.com/66c5be6d-b895-4170-9fe4-1d29253008f0', 
    redirectUri: 'https://globallogin-baeecpe6hrhedqan.centralus-01.azurewebsites.net', 
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage
  }
};