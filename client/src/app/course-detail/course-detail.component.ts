import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NachhilfeService} from '../shared/nachhilfe.service';
import {Course} from '../shared/models/course';
import {AppointmentListComponent} from '../appointment-list/appointment-list.component';
import {AuthenticationService} from '../shared/authentication.service';
import {Appointment} from '../shared/models/appointment';
import {AppointmentFormComponent} from '../appointment-form/appointment-form.component';
import {NgIf} from '@angular/common';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'nh-course-detail',
  imports: [
    AppointmentListComponent,
    AppointmentFormComponent,
    RouterLink,
    NgIf,
  ],
  templateUrl: './course-detail.component.html',
  styles: ``
})
export class CourseDetailsComponent  implements OnInit {
  // signal von liste, muss writeable sein, weil wir es evtl. editieren
  course = signal<Course | null>(null);
  appointments = signal<Appointment[]>([]);
  showForm: boolean = false;
  constructor(
    private nh:NachhilfeService,
    private route:ActivatedRoute,
    private authService:AuthenticationService,
    private router:Router,
    private toastr:ToastrService

  ) {
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.nh.getSingleCourse(params['subjectId'], params['courseId']).subscribe((c: Course) => {
      this.course.set(c);
    });
  }

  isTeacher() {
    return this.authService.isTeacher();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  addAppointment() {
    this.showForm = !this.showForm;
  }

  deleteCourse() {
    if (this.course()) {
      if (confirm('Kurs mit Terminen wirklich löschen?')) {
        this.nh.deleteCourse(this.course()!.subject.id, this.course()!.id).subscribe(() => {
          this.router.navigate(['/subjects', this.course()!.subject!.id]);
          this.toastr.success('Kurs erfolgreich gelöscht', 'Nachhilfe25');
        });
      }
    }
  }


}
