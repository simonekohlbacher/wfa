import {Component, input} from '@angular/core';
import {Course} from '../shared/models/course';

@Component({
  selector: 'nh-course-list-item',
  standalone: true,
  imports: [],
  templateUrl: './course-list-item.component.html',
  styles: ``
})

export class CourseListItemComponent {
  // von parent
  course = input.required<Course>();
}
