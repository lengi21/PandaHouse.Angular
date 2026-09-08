import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/i18n/language.service';
import { ToastContainer } from './shared/ui/toast-container/toast-container';
import { FullPageLoader } from './shared/ui/full-page-loader/full-page-loader';

@Component({
  imports: [FullPageLoader, RouterOutlet, ToastContainer],
  selector: 'app-root',
  styles: [],
  template: '<router-outlet /><app-full-page-loader /><app-toast-container />',
})
export class App {
  private readonly languageService = inject(LanguageService);
}
