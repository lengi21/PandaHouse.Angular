import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminSession, AdminSignInCredentials } from '../../../shared/models/admin-auth.model';

export interface AdminAuthRepository {
  signIn(credentials: AdminSignInCredentials): Observable<AdminSession>;
  refresh(refreshToken: string): Observable<AdminSession>;
}

export const ADMIN_AUTH_REPOSITORY = new InjectionToken<AdminAuthRepository>('ADMIN_AUTH_REPOSITORY');
