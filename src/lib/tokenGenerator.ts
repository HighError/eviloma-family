export default function generateTokenKey(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let tokenKey = '';

  for (let i = 0; i < length; i++) {
    tokenKey += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return tokenKey;
}
