/** Local NestJS API. Replace this one value with the production API origin at deployment time. */
export const API_ORIGIN = 'http://localhost:3000';

export function apiUrl(path: string): string {
  return `${API_ORIGIN}${path}`;
}
