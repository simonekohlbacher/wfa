import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthenticationService} from './shared/authentication.service';

@Component({
  selector: 'nh-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'nachhilfe25';

  constructor(
    private authService: AuthenticationService) {
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}
