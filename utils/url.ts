export function pathFromUrl(url: string): string {
  return new URL(url).pathname
}
