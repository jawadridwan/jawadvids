
/**
 * Format a number as a compact string with K, M, B suffix
 * e.g. 1000 -> 1K, 1000000 -> 1M
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  const exp = Math.floor(Math.log10(num) / 3);
  const value = num / Math.pow(1000, exp);
  const suffix = ['', 'K', 'M', 'B', 'T'][exp];
  return value.toFixed(1).replace(/\.0$/, '') + suffix;
}

/**
 * Format a time duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Format a date as a relative time (e.g. "5 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

/**
 * Format a number with commas
 * e.g. 1000 -> 1,000
 */
export function formatNumberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
