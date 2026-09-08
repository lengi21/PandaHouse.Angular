import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { MockHttpClient } from '../../http/mock-http-client.service';
import { apiUrl } from '../../http/api-endpoints';
import { AdminSession, AdminSignInCredentials } from '../../../shared/models/admin-auth.model';
import { AdminAuthRepository } from './admin-auth.repository';

const mockAdmin = {
  email: 'admin@pandahouse.ge',
  password: 'PandaHouse2026!',
} as const;

@Service()
export class MockAdminAuthRepository implements AdminAuthRepository {
  private readonly http = inject(MockHttpClient);

  signIn(credentials: AdminSignInCredentials): Observable<AdminSession> {
    return this.http.post(apiUrl('/api/admin/auth/sign-in'), credentials, (request) => {
      const normalizedEmail = request.email.trim().toLowerCase();
      if (normalizedEmail !== mockAdmin.email || request.password !== mockAdmin.password) {
        throw new Error('INVALID_CREDENTIALS');
      }

      return {
        accessToken: 'mock-admin-session-token',
        email: mockAdmin.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
      };
    });
  }
}
