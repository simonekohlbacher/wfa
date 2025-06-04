import {Component, input, output, signal} from '@angular/core';
import {Appointment} from '../shared/models/appointment';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "../shared/authentication.service";
import {Registration} from "../shared/models/registration";
import {NachhilfeService} from "../shared/nachhilfe.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from 'ngx-toastr';
import {AppointmentFormComponent} from "../appointment-form/appointment-form.component";
import {User} from '../shared/models/user';

@Component({
  selector: 'nh-appointment-list-item',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    AppointmentFormComponent,
  ],
  templateUrl: './appointment-list-item.component.html',
  styles: ``
})
export class AppointmentListItemComponent {
  formMap: { [key: number]: FormGroup } = {};
  appointment = input.required<Appointment>();
  isOpen = signal(false);
  showForm: boolean = false;
  updated = output<Appointment>();

  constructor(
    private authService:AuthenticationService,
    private nh:NachhilfeService,
    private fb:FormBuilder,
    private route:ActivatedRoute,
    private router:Router,
    private toastr:ToastrService,
  ) {
  }


  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getCurrentUser () {
    return this.authService.getCurrentUser();
  }

  isTeacher() {
    return this.authService.isTeacher();
  }
  editAppointment() {
    this.showForm = !this.showForm;
  }

  deleteAppointment() {
    if(confirm('Termin wirklich löschen?')){
      const params = this.route.snapshot.params;
      this.nh.deleteAppointment(params["subjectId"], params["courseId"], this.appointment().id).subscribe(() => {
        // Angular lädt die Komponente nicht neu, wenn man auf dieselbe Route navigiert – deshalb wird kurz auf / gewechselt, um die View zwangszureloaden, gab probleme mit signal und updaten, verschachtelung
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.toastr.success('Termin erfolgreich gelöscht',"Nachhilfe25");
          this.router.navigate(['/subjects', params["subjectId"], 'courses', params["courseId"]]);
        });
      });
    }
  }


  createRegistration(appointmentId: number) {
    // forumlar nach appointmentId, weil mehrere möglich
    const form = this.getFormGroup(appointmentId);
    const comment = form.get('comment')?.value || '';
    if (confirm('Anfrage wirklich senden?')) {
      // hier wäre auch ein fromObject methode möglich mit factory, aber mehrere möglichkeiten versucht, so kürzer als ganzes ts file
      // help from chatgpt
      const registration = new Registration(
        0,
        'requested',
        'Angefragt',
        this.getCurrentUser() as any,
        this.getCurrentUser().id as number,
        this.appointment(),
        this.appointment().id as number,
        comment
      );
      this.nh.registerForAppointment(registration).subscribe({
        next: () => {
          form.reset();
          this.toastr.success('Anfrage erfolgreich gesendet', 'Nachhilfe25');
          this.updated.emit(this.appointment()); // emit appointment, damit item in der liste aktualisiert wird, in appointment list html
          this.isOpen.set(false); // zuklappen des items
        },
        // bei 400 fehler von BE hat sich User:in schon registriert, daher error message
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error('Du hast dich bereits für diesen Termin registriert.', 'Nachhilfe25');
          }
        }
      });
    }
  }



  // für jeden appointment eine eigene FormGroup, pro appointmentId
  // help from chat
  getFormGroup(appointmentId: number): FormGroup {
    // wenn noch keines vorhanden ist, erstelle eines, sonst gib bestehendes zurück
    if (!this.formMap[appointmentId]) {
      this.formMap[appointmentId] = this.fb.group({
        comment: ['']
      });
    }
    return this.formMap[appointmentId];
  }



}
