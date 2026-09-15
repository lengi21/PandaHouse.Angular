import { inject, Service } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MockHttpClient } from '../../http/mock-http-client.service';
import { apiUrl } from '../../http/api-endpoints';
import { AdminSession, AdminSignInCredentials } from '../../../shared/models/admin-auth.model';
import { AdminAuthRepository } from './admin-auth.repository';

const mockAdmin = { email: 'admin@pandahouse.ge', password: 'PandaHouse2026!' } as const;
const mockSession = (): AdminSession => ({ accessToken: 'mock-admin-session-token', refreshToken: 'mock-admin-refresh-token', email: mockAdmin.email, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString() });
@Service()
export class MockAdminAuthRepository implements AdminAuthRepository {
  private readonly http = inject(MockHttpClient);
  signIn(credentials: AdminSignInCredentials): Observable<AdminSession> {
    return this.http.post(apiUrl('/api/admin/auth/sign-in'), credentials, request => {
      if (request.email.trim().toLowerCase() !== mockAdmin.email || request.password !== mockAdmin.password) throw new Error('INVALID_CREDENTIALS');
      return mockSession();
    });
  }
  refresh(refreshToken: string): Observable<AdminSession> { return refreshToken ? of(mockSession()) : throwError(() => new Error('INVALID_REFRESH')); }
}
