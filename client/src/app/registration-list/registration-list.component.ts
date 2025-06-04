import {Component, OnInit, signal} from '@angular/core';
import { Registration } from '../shared/models/registration';
import {NachhilfeService} from '../shared/nachhilfe.service';
import {RouterLink} from '@angular/router';
import {RegistrationListItemComponent} from '../registration-list-item/registration-list-item.component';
import {NgIf} from '@angular/common';
import {AuthenticationService} from '../shared/authentication.service';

@Component({
  selector: 'nh-registration-list',
  imports: [
    RouterLink,
    RegistrationListItemComponent,
    NgIf,
  ],
  providers: [{provide: NachhilfeService, useClass:NachhilfeService}],
  templateUrl: './registration-list.component.html',
  styles: ``
})
export class RegistrationListComponent implements OnInit {

  constructor(
    private nh:NachhilfeService,
    private authService:AuthenticationService,
  ) {
  }
  registrations = signal<Registration[]>([]);
  // flags die anzeigen, welche liste angezeigt werden soll, filtert je nach status
  showRequested = signal(false);
  showConfirmed = signal(false);
  showCompleted = signal(false);


  ngOnInit() {
      this.nh.getAllRegistrations().subscribe((res) => {
        this.registrations.set(res as Registration[]);
      });
  }


  get requestedRegistrations(): Registration[] {
    return this.registrations().filter(r => r.status === 'requested');
  }

  get confirmedRegistrations(): Registration[] {
    return this.registrations().filter(r => r.status === 'accepted');
  }

  get completedRegistrations(): Registration[] {
    return this.registrations().filter(r => r.status === 'completed' || r.status === 'missed' || r.status === 'denied');
  }

  isTeacher() {
    return this.authService.isTeacher();
  }
}
