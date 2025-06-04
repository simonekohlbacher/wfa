import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NachhilfeService} from '../shared/nachhilfe.service';
import {Subject} from '../shared/models/subject';
import {CourseListComponent} from '../course-list/course-list.component';
import {SubjectFormComponent} from '../subject-form/subject-form.component';
import {AuthenticationService} from '../shared/authentication.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'nh-subject-details',
  imports: [
    RouterLink,
    CourseListComponent,
    SubjectFormComponent,
  ],
  templateUrl: './subject-detail.component.html',
  styles: ``
})
export class SubjectDetailsComponent  implements OnInit {
  subject = signal<Subject|null>(null);
  showForm: boolean = false;
  // mit signal gab es Probleme, daher nur boolean der "reload-trigger" auslöst
  reloadCourses = false;
  constructor(
    private nh:NachhilfeService,
    private route:ActivatedRoute,
    private router:Router,
    private authService:AuthenticationService,
    private toastr:ToastrService,
  ) {
  }

  ngOnInit() {
    this.loadSubject();
  }

  loadSubject() {
    const params = this.route.snapshot.params;
    this.nh.getSingleSubject(params['subjectId']).subscribe({
      next: (s: Subject) =>  {
        this.subject.set(s);
        // wert von reloadCourses umschalten, damit Kurse neu geladen werden, trigger
        this.reloadCourses = !this.reloadCourses;
        this.showForm = false;
      },
      // für weiterleitung bei Fehler
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/not-found']);
        }
      }
    });
  }

  editSubject() {
    this.showForm = !this.showForm;
  }

  deleteSubject(){
    if(this.subject()) {
      if(confirm('Fach und zugehörige Kurse wirklich löschen?')){
        this.nh.deleteSubject(this.subject()!.id).subscribe(() => {
            this.router.navigate(['../'], {relativeTo: this.route});
            this.toastr.success('Fach erfolgreich gelöscht', 'Nachhilfe25');
          }
        );
      }
    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isTeacher() {
    return this.authService.isTeacher();
  }


}
