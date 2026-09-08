import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class CustomerLayout {}
