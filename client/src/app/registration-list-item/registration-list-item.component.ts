import {Component, input} from '@angular/core';
import {Registration} from '../shared/models/registration';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'a.nh-registration-list-item',
  standalone: true,
  imports: [
    DatePipe,
  ],
  templateUrl: './registration-list-item.component.html',
  styles: ``
})
export class RegistrationListItemComponent {
  registration = input.required<Registration>();
}




