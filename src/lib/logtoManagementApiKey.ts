import axios from 'axios';

export default async function getKey() {
  try {
    const { data } = await axios.post(
      `${process.env.LOGTO_ENDPOINT}oidc/token`,
      {
        grant_type: 'client_credentials',
        resource: 'https://default.logto.app/api',
        scope: 'all',
      },
      {
        auth: {
          username: process.env.LOGTO_MANAGEMENT_LOGIN ?? '',
          password: process.env.LOGTO_MANAGEMENT_PASS ?? '',
        },
      }
    );
    return data.access_token ?? null;
  } catch (err) {
    return null;
  }
}
