import { computed, inject, Service, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ADMIN_AUTH_REPOSITORY } from '../data-access/auth/admin-auth.repository';
import { LocalStorageService } from '../storage/local-storage.service';
import { AdminSession, AdminSignInCredentials } from '../../shared/models/admin-auth.model';

const sessionStorageKey = 'panda-house.admin-session';
@Service()
export class AdminAuthService {
  private readonly repository = inject(ADMIN_AUTH_REPOSITORY);
  private readonly storage = inject(LocalStorageService);
  readonly session = signal<AdminSession | null>(this.readStoredSession());
  readonly isAuthenticated = computed(() => this.session() !== null);
  signIn(credentials: AdminSignInCredentials): Observable<AdminSession> {
    return this.repository.signIn(credentials).pipe(tap(session => this.save(session)), catchError(() => throwError(() => new Error('INVALID_CREDENTIALS'))));
  }
  refresh(): Observable<AdminSession> {
    const refreshToken = this.session()?.refreshToken;
    return refreshToken ? this.repository.refresh(refreshToken).pipe(tap(session => this.save(session))) : throwError(() => new Error('NO_REFRESH_TOKEN'));
  }
  signOut(): void { this.session.set(null); this.storage.remove(sessionStorageKey); }
  private save(session: AdminSession): void { this.session.set(session); this.storage.set(sessionStorageKey, JSON.stringify(session)); }
  private readStoredSession(): AdminSession | null {
    const storedValue = this.storage.get(sessionStorageKey); if (!storedValue) return null;
    try { const session = JSON.parse(storedValue) as AdminSession; return session.accessToken && session.refreshToken && session.email ? session : null; } catch { return null; }
  }
}
