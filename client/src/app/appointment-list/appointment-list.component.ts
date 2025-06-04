import {Component, Input, OnInit, signal} from '@angular/core';
import {NachhilfeService} from '../shared/nachhilfe.service';
import {Appointment} from '../shared/models/appointment';
import {AppointmentListItemComponent} from '../appointment-list-item/appointment-list-item.component';
import {AuthenticationService} from '../shared/authentication.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'nh-appointment-list',
  templateUrl: './appointment-list.component.html',
  styles: ``,
  imports: [
    AppointmentListItemComponent,
  ]
})
export class AppointmentListComponent implements OnInit {
  appointments = signal<Appointment[]>([]);

  constructor(
    private nh:NachhilfeService,
    private authService:AuthenticationService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    const { subjectId, courseId } = this.route.snapshot.params;
    this.nh.getAllAppointmentsForCourse(subjectId, courseId).subscribe(res => this.appointments.set(res));
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isTeacher() {
    return this.authService.isTeacher();
  }



}
