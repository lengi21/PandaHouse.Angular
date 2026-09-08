/** Temporary API origin. Replace with the deployed API origin through environment configuration later. */
export const MOCK_API_ORIGIN = 'https://api.pandahouse.local';

export function apiUrl(path: string): string {
  return `${MOCK_API_ORIGIN}${path}`;
}
