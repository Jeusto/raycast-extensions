export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function formatURL(url: string): string {
  const prefixRegex = /^(https?:\/\/(www\.)?)/;
  const cleanedUrl = url.replace(prefixRegex, "").replace(/\/$/, "");
  return cleanedUrl.slice(0, 50) + (cleanedUrl.length > 50 ? "..." : "");
}
