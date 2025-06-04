import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NachhilfeService} from '../shared/nachhilfe.service';
import {Registration} from '../shared/models/registration';
import {DatePipe} from '@angular/common';
import {AuthenticationService} from '../shared/authentication.service';
import {FormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'nh-registration-detail',
  imports: [
    DatePipe,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './registration-detail.component.html',
  styles: ``
})
export class RegistrationDetailsComponent  implements OnInit {
  registration = signal<Registration|undefined>(undefined);
  constructor(
    private nh:NachhilfeService,
    private route:ActivatedRoute,
    private authService:AuthenticationService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.nh.getSingleRegistration(params['id']).subscribe((r: Registration) => {
      this.registration.set(r);
    });
  }

  updateStatus(registration: Registration) {
    this.nh.updateRegistrationStatus(registration).subscribe(() => {
      this.toastr.success('Status erfolgreich abgeändert', 'Nachhilfe25');
    });
  }


  isTeacher() {
    return this.authService.isTeacher();
  }
}
