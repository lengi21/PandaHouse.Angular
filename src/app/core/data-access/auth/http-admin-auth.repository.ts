import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../http/api-endpoints';
import { AdminAuthRepository } from './admin-auth.repository';
import { AdminSession, AdminSignInCredentials } from '../../../shared/models/admin-auth.model';

@Service()
export class HttpAdminAuthRepository implements AdminAuthRepository {
  private readonly http = inject(HttpClient);

  signIn(credentials: AdminSignInCredentials): Observable<AdminSession> {
    return this.http.post<AdminSession>(apiUrl('/api/admin/auth/sign-in'), credentials);
  }
}
