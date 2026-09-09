import { AppEnvironment } from './environment.model';

/**
 * Used only by `pnpm start:mobile`. The Angular development server proxies
 * these same-origin paths to the local Nest API, so a phone never treats its
 * own localhost as the API server.
 */
export const environment: AppEnvironment = {
  production: false,
  apiOrigin: '',
};
