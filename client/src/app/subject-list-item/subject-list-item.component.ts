import {Component, input} from '@angular/core';
import {Subject} from '../shared/models/subject';

@Component({
  selector: 'a.nh-subject-list-item',
  imports: [],
  templateUrl: './subject-list-item.component.html',
  styles: ``
})

export class SubjectListItemComponent {
  subject = input.required<Subject>();

}
