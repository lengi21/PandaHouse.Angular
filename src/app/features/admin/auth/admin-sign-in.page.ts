import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { retry } from 'rxjs';
import { AdminAuthService } from '../../../core/auth/admin-auth.service';
import { TextInput } from '../../../shared/ui/text-input/text-input';
import { ActionLoaderService } from '../../../core/feedback/action-loader.service';
import { ToastService } from '../../../core/feedback/toast.service';

@Component({
  selector: 'app-admin-sign-in-page',
  imports: [ReactiveFormsModule, TextInput, TranslatePipe],
  styles: `
    :host { display: grid; min-block-size: 100dvh; place-items: center; padding: 1rem; background: var(--color-shell); }
    main { inline-size: min(100%, 27rem); padding: 2rem; border: 1px solid rgb(255 255 255 / 12%); border-radius: 1.25rem; background: var(--color-panel); box-shadow: 0 1rem 3rem rgb(0 0 0 / 28%); }
    .brand { display: flex; align-items: center; gap: .75rem; margin-block-end: 1.8rem; }
    .brand img { inline-size: 3rem; block-size: 3rem; border-radius: 50%; object-fit: cover; object-position: center 34%; background: #eff5d6; }
    .brand span { display: grid; gap: .1rem; font-weight: 700; }
    .brand small { color: var(--color-muted-text); font-size: .65rem; letter-spacing: .1em; }
    h1 { margin: 0; font-size: 1.5rem; }
    .intro { margin: .5rem 0 1.5rem; color: var(--color-muted-text); font-size: .88rem; line-height: 1.5; }
    form { display: grid; gap: 1rem; }
    .error { min-block-size: 1rem; margin: -.5rem 0 0; color: #bb3030; font-size: .76rem; font-weight: 600; }
    button { min-block-size: 3rem; border: 0; border-radius: .75rem; background: var(--color-primary); color: var(--color-on-image); cursor: pointer; font: inherit; font-weight: 700; }
    button:disabled { cursor: wait; opacity: .65; }
    @media (max-width: 28rem) { :host { padding: .7rem; } main { padding: 1.35rem; border-radius: 1rem; } .brand { margin-block-end: 1.25rem; } .brand small { font-size: .56rem; } h1 { font-size: 1.3rem; } }
  `,
  template: `
    <main>
      <div class="brand">
        <img src="/brand/panda-house-logo.jpeg" alt="" />
        <span>Panda House <small>ADMINISTRATION</small></span>
      </div>
      <h1>{{ 'ADMIN.SIGN_IN.TITLE' | translate }}</h1>
      <p class="intro">{{ 'ADMIN.SIGN_IN.DESCRIPTION' | translate }}</p>
      <form [formGroup]="form" (ngSubmit)="signIn()">
        <app-text-input
          formControlName="email"
          [label]="'ADMIN.SIGN_IN.EMAIL' | translate"
          name="email"
          type="email"
          autocomplete="email"
          [required]="true"
        />
        <app-text-input
          formControlName="password"
          [label]="'ADMIN.SIGN_IN.PASSWORD' | translate"
          name="password"
          type="password"
          autocomplete="current-password"
          [required]="true"
        />
        <p class="error" aria-live="polite">@if (error()) { {{ 'ADMIN.SIGN_IN.INVALID_CREDENTIALS' | translate }} }</p>
        <button type="submit" [disabled]="form.invalid || submitting()">{{ (submitting() ? 'ADMIN.SIGN_IN.SUBMITTING' : 'ADMIN.SIGN_IN.SUBMIT') | translate }}</button>
      </form>
    </main>
  `,
})
export class AdminSignInPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AdminAuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loader = inject(ActionLoaderService);
  private readonly toasts = inject(ToastService);

  protected readonly submitting = signal(false);
  protected readonly error = signal(false);
  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected signIn(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(false);
    this.submitting.set(true);
    this.loader.start();
    this.auth
      .signIn(this.form.getRawValue())
      .pipe(retry({ count: 2, delay: 350 }), finalize(() => { this.submitting.set(false); this.loader.finish(); }))
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          void this.router.navigateByUrl(returnUrl?.startsWith('/admin') ? returnUrl : '/admin/dashboard');
        },
        error: () => { this.error.set(true); this.toasts.show('error', 'ADMIN.SIGN_IN.INVALID_CREDENTIALS'); },
      });
  }
}
