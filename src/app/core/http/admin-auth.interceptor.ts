import { HttpInterceptorFn } from '@angular/common/http';

const sessionStorageKey = 'panda-house.admin-session';

export const adminAuthInterceptor: HttpInterceptorFn = (request, next) => {
  try {
    const storedSession = localStorage.getItem(sessionStorageKey);
    const session = storedSession ? JSON.parse(storedSession) as { accessToken?: string; expiresAt?: string } : null;
    if (session?.accessToken && session.expiresAt && new Date(session.expiresAt).getTime() > Date.now()) {
      return next(request.clone({ setHeaders: { Authorization: `Bearer ${session.accessToken}` } }));
    }
  } catch {
    // Requests remain anonymous when browser storage is unavailable.
  }
  return next(request);
};
