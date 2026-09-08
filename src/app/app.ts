import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/i18n/language.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styles: [],
  template: '<router-outlet />',
})
export class App {
  private readonly languageService = inject(LanguageService);
}
