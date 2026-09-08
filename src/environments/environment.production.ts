import { AppEnvironment } from './environment.model';

/**
 * Production uses same-origin API paths. Configure Nginx to proxy `/api` and `/uploads`
 * to NestJS, so no domain name is embedded in the Angular bundle.
 */
export const environment: AppEnvironment = {
  production: true,
  apiOrigin: '',
};
