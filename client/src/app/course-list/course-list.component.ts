import {Component, input, Input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {Course} from '../shared/models/course';
import {NachhilfeService} from '../shared/nachhilfe.service';
import {CourseListItemComponent} from '../course-list-item/course-list-item.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'nh-course-list',
  imports: [
    CourseListItemComponent,
    RouterLink,
  ],
  templateUrl: './course-list.component.html',
  styles: ``
})
export class CourseListComponent implements OnChanges, OnInit {
  // kommt von subject detail parent
  subjectId = input<number>();
  courses = signal<Course[]>([]);
  // kommt von subject detail parent
  @Input() reloadTrigger!: boolean;

  constructor(
    private nh:NachhilfeService,
  ) {}
  ngOnInit() {
    this.loadCourses();
  }

  // wird automatisch aufgerufen, wenn sich die Inputs ändern, also reloadTrigger
  // interface https://angular.dev/api/core/SimpleChanges
  ngOnChanges(changes: SimpleChanges) {
    if (changes['reloadTrigger']) {
      this.loadCourses();
    }
  }

  loadCourses() {
    const id = this.subjectId();
    if (id) {
      this.nh.getCoursesForSubject(id).subscribe(res => {
        this.courses.set(res);
      });
    }
  }


}
