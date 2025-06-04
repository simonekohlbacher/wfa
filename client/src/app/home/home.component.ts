import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthenticationService} from '../shared/authentication.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'nh-home',
  imports: [
    RouterLink,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  constructor(
    private authService: AuthenticationService) {
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser () {
    return this.authService.getCurrentUser();
  }

  isTeacher() {
    return this.authService.isTeacher();
  }

}
