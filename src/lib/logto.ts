// libraries/logto.js
import LogtoClient from '@logto/next/edge';

export const logtoClient = new LogtoClient({
  appId: process.env.LOGTO_APP_ID ?? '',
  appSecret: process.env.LOGTO_APP_SECRET ?? '',
  endpoint: process.env.LOGTO_ENDPOINT ?? '',
  baseUrl: process.env.BASE_URL ?? '',
  cookieSecret: process.env.LOGTO_COOKIE_SECRET ?? '',
  cookieSecure: process.env.NODE_ENV === 'production',
  scopes: ['email', 'identities'],
});

export const logtoUserEndPoint = `${process.env.LOGTO_ENDPOINT}api/users`;
