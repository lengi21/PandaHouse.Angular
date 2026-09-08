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
  private readonly storedSession = this.readStoredSession();

  readonly session = signal<AdminSession | null>(this.storedSession);
  readonly isAuthenticated = computed(() => this.session() !== null);

  signIn(credentials: AdminSignInCredentials): Observable<AdminSession> {
    return this.repository.signIn(credentials).pipe(
      tap((session) => {
        this.session.set(session);
        this.storage.set(sessionStorageKey, JSON.stringify(session));
      }),
      catchError(() => throwError(() => new Error('INVALID_CREDENTIALS'))),
    );
  }

  signOut(): void {
    this.session.set(null);
    this.storage.remove(sessionStorageKey);
  }

  private readStoredSession(): AdminSession | null {
    const storedValue = this.storage.get(sessionStorageKey);
    if (!storedValue) {
      return null;
    }

    try {
      const session = JSON.parse(storedValue) as AdminSession;
      return new Date(session.expiresAt).getTime() > Date.now() && session.accessToken && session.email
        ? session
        : null;
    } catch {
      return null;
    }
  }
}
