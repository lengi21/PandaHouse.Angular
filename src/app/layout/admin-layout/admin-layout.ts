import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminAuthService } from '../../core/auth/admin-auth.service';
import { LanguageService } from '../../core/i18n/language.service';
import { LanguagePicker } from '../../shared/ui/language-picker/language-picker';
import { AdminAccountMenu } from '../../shared/ui/admin-account-menu/admin-account-menu';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminAccountMenu, LanguagePicker, MatIcon, RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  styles: `
    :host { display: block; min-block-size: 100dvh; background: var(--color-background); color: var(--color-text); }
    .layout { display: grid; grid-template-columns: 15rem minmax(0, 1fr); min-block-size: 100dvh; }
    aside { display: flex; position: sticky; inset-block-start: 0; flex-direction: column; block-size: 100dvh; padding: 1rem .8rem; background: var(--color-shell); color: var(--color-shell-text); }
    .brand { display: flex; align-items: center; gap: .6rem; padding: .25rem .45rem 1.25rem; color: inherit; text-decoration: none; }
    .brand img { inline-size: 2.35rem; block-size: 2.35rem; border-radius: 50%; object-fit: cover; object-position: center 34%; background: #eff5d6; }
    .brand span { display: grid; gap: .1rem; font-size: .85rem; font-weight: 700; letter-spacing: .03em; }
    .brand small { color: color-mix(in srgb, var(--color-shell-text) 65%, transparent); font-size: .48rem; letter-spacing: .1em; }
    nav { display: grid; gap: .2rem; }
    nav a { display: flex; align-items: center; gap: .7rem; min-block-size: 2.65rem; padding: .45rem .7rem; border-radius: .5rem; color: color-mix(in srgb, var(--color-shell-text) 72%, transparent); font-size: .76rem; text-decoration: none; }
    nav a mat-icon { inline-size: 1.05rem; block-size: 1.05rem; font-size: 1.05rem; }
    nav a.active, nav a:hover { background: color-mix(in srgb, var(--color-primary) 72%, transparent); color: #fff; }
    .account { margin-block-start: auto; padding: 1rem .45rem .25rem; border-block-start: 1px solid rgb(255 255 255 / 14%); }
    .avatar { display: grid; inline-size: 1.8rem; block-size: 1.8rem; place-items: center; border-radius: 50%; background: var(--color-primary); color: #fff; font-size: .7rem; font-weight: 700; }
    .account-email { overflow: hidden; flex: 1; color: color-mix(in srgb, var(--color-shell-text) 75%, transparent); font-size: .67rem; text-overflow: ellipsis; white-space: nowrap; }
    .sign-out { display: grid; inline-size: 2rem; block-size: 2rem; place-items: center; border: 0; border-radius: .45rem; background: transparent; color: var(--color-shell-text); cursor: pointer; }
    .sign-out mat-icon { inline-size: 1.1rem; block-size: 1.1rem; font-size: 1.1rem; }
    section { min-inline-size: 0; }
    header { display: flex; align-items: center; justify-content: flex-end; gap: .75rem; min-block-size: 4.15rem; padding: .65rem clamp(1rem, 3vw, 2.5rem); border-block-end: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); background: var(--color-panel); }
    .user { display: flex; align-items: center; gap: .45rem; font-size: .72rem; font-weight: 600; }
    .user .avatar { inline-size: 1.7rem; block-size: 1.7rem; }
    @media (max-width: 52rem) {
      .layout { grid-template-columns: 1fr; }
      aside { position: sticky; z-index: 20; inset-block-start: 0; block-size: auto; padding: .55rem max(1rem, env(safe-area-inset-left)); box-shadow: 0 .35rem 1rem rgb(0 0 0 / 18%); }
      .brand { padding: 0 .15rem .5rem; }
      nav { display: flex; gap: .35rem; overflow-x: auto; padding-block-end: .1rem; scrollbar-width: none; }
      nav::-webkit-scrollbar { display: none; }
      nav a { flex: 0 0 auto; min-block-size: 2.3rem; padding-inline: .65rem; }
      .account { display: none; }
      header { min-block-size: 3.65rem; padding-inline: max(1rem, env(safe-area-inset-left)); }
    }
    @media (max-width: 32rem) { .brand span { font-size: .76rem; } .brand img { inline-size: 2.05rem; block-size: 2.05rem; } nav a { inline-size: 2.55rem; justify-content: center; padding: .4rem; font-size: 0; } nav a mat-icon { inline-size: 1.2rem; block-size: 1.2rem; font-size: 1.2rem; } .user { display: block; } header { min-block-size: 3.35rem; } }
  `,
  template: `
    <div class="layout">
      <aside>
        <a class="brand" routerLink="/admin/dashboard">
          <img src="/brand/panda-house-logo.jpeg" alt="" />
          <span>PANDA HOUSE <small>RESTAURANT ADMIN</small></span>
        </a>
        <nav [attr.aria-label]="'ADMIN.NAVIGATION.LABEL' | translate">
          <a routerLink="/admin/dashboard" routerLinkActive="active"><mat-icon aria-hidden="true">dashboard</mat-icon>{{ 'ADMIN.NAVIGATION.DASHBOARD' | translate }}</a>
          <a routerLink="/admin/categories" routerLinkActive="active"><mat-icon aria-hidden="true">category</mat-icon>{{ 'ADMIN.NAVIGATION.CATEGORIES' | translate }}</a>
          <a routerLink="/admin/dishes" routerLinkActive="active"><mat-icon aria-hidden="true">restaurant_menu</mat-icon>{{ 'ADMIN.NAVIGATION.DISHES' | translate }}</a>
          <a routerLink="/admin/settings" routerLinkActive="active"><mat-icon aria-hidden="true">storefront</mat-icon>{{ 'ADMIN.NAVIGATION.RESTAURANT' | translate }}</a>
          <a routerLink="/categories"><mat-icon aria-hidden="true">open_in_new</mat-icon>{{ 'ADMIN.NAVIGATION.BACK_TO_MENU' | translate }}</a>
        </nav>
        <div class="account">
          <app-admin-account-menu [email]="auth.session()?.email ?? ''" (signOut)="signOut()" />
        </div>
      </aside>
      <section>
        <header>
          <app-language-picker [label]="'HEADER.LANGUAGE' | translate" [languages]="languageService.availableLanguages" [value]="languageService.currentLanguage()" (valueChange)="languageService.changeLanguage($event)" />
          <div class="user"><app-admin-account-menu [email]="auth.session()?.email ?? ''" [compact]="true" (signOut)="signOut()" /></div>
        </header>
        <router-outlet />
      </section>
    </div>
  `,
})
export class AdminLayout {
  protected readonly auth = inject(AdminAuthService);
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  protected signOut(): void {
    this.auth.signOut();
    void this.router.navigateByUrl('/admin/sign-in');
  }
}
