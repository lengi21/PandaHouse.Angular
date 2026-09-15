import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AdminAuthService } from '../auth/admin-auth.service';

export const adminAuthInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);
  const isAuthRequest = request.url.includes('/admin/auth/sign-in') || request.url.includes('/admin/auth/refresh');
  const session = auth.session();
  const authorized = !isAuthRequest && session?.accessToken ? request.clone({ setHeaders: { Authorization: `Bearer ${session.accessToken}` } }) : request;
  return next(authorized).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status !== 401 || isAuthRequest) return throwError(() => error);
    return auth.refresh().pipe(
      switchMap(refreshed => next(request.clone({ setHeaders: { Authorization: `Bearer ${refreshed.accessToken}` } }))),
      catchError(refreshError => { auth.signOut(); void router.navigate(['/admin/sign-in']); return throwError(() => refreshError); }),
    );
  }));
};
