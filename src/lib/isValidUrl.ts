export default function isValidUrl(url: string) {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}
