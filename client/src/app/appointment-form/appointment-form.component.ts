import {Component, input, OnInit, output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {NachhilfeService} from '../shared/nachhilfe.service';
import {AppointmentFactory} from '../shared/appointment-factory';
import {FormErrorMessages} from '../shared/form-error-messages';
import {ToastrService} from 'ngx-toastr';
import {Appointment} from '../shared/models/appointment';
import {DateValidators} from '../shared/date-validator';

@Component({
  selector: 'nh-appointment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './appointment-form.component.html',
  styles: ``,
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isUpdatingAppointment: boolean = false;
  appointment = AppointmentFactory.empty(); // leeres Appointment-Objekt
  errors: { [key: string]: string } = {};
  appointmentId = input<number>(); // id von parent
  saved = output<any>(); // wird gefeuert wenn Formular gespeichert wird
  minDateTime: string = ''; // Minimum-Datum für Input-Feld

  constructor(
    private fb: FormBuilder,
    private router:Router,
    private nh: NachhilfeService,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
    // form gleich zu beginn initialisieren, sonst kann formular nicht validiert werden
    this.appointmentForm = this.fb.group({
      id: [null],
      start_at: [''],
      end_at: [''],
      price: [null],
      course_id: [null],
    });
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    const id = this.appointmentId();
    const now = new Date(); // heutiges Datum beim initialisieren, im html wird dann minDateTime verwendet
    this.minDateTime = this.formatDateToInputValue(now);
    if (id) {
      // update
      this.isUpdatingAppointment = true;
      this.nh.getSingleAppointment(params["subjectId"], params["courseId"], id).subscribe(appointment =>{
        this.appointment = appointment;
        this.initAppointment();
      });
    }
    // bei neuem termin die kurs id setzen
    this.appointment.course_id = params['courseId'];
    this.initAppointment();

  }

  // Hilfsfunktion, formatiert JS Date-Objekt in das Format, das für das Input-Feld benötigt wird (datetime-local)
  // Zb "2025-05-02T14:30"
  private formatDateToInputValue(date: Date): string {
    // Format: YYYY-MM-DDTHH:mm
    return date.toISOString().slice(0, 16);
  }


  initAppointment() {
    this.appointmentForm = this.fb.group({
      id: this.appointment.id,
      start_at: [this.appointment.start_at, Validators.required],
      end_at: [this.appointment.end_at, Validators.required],
      price: [this.appointment.price, Validators.min(0)],
      course_id: this.appointment.course_id,
        // custom validator in shared/date-validator.ts
  }, { validators: DateValidators.endAfterStartValidator() });
    this.appointmentForm.statusChanges.subscribe(() => {
      this.updateErrorMessages();
    });
  }


  updateErrorMessages() {
    this.errors = {};
    // wie bisherrige
    for (const message of FormErrorMessages) {
      const control = this.appointmentForm.get(message.forControl);
      if (control && control.dirty && control.invalid && control.errors &&
        control.errors[message.forValidator] && !control.errors[message.forControl]) {
        this.errors[message.forControl] = message.text;
      }
    }
    // zusätzlich custom validator mit ende nicht vor start checken
    // help from chatgpt
    const groupErrors = this.appointmentForm.errors;
    if (groupErrors) {
      for (const message of FormErrorMessages) {
        if (message.forControl === 'end_at' && groupErrors[message.forValidator]) {
          this.errors['end_at'] = message.text;
        }
      }
    }
  }


  submitForm() {
    // formulardaten holen
    const rawValue = this.appointmentForm.value;
    const appointmentToSave = {
      ...rawValue,
      start_at: this.toBackendDateTime(rawValue.start_at),
      end_at: this.toBackendDateTime(rawValue.end_at),
    };
    const appointment = AppointmentFactory.fromObject(appointmentToSave);
    const params = this.route.snapshot.params;
    // in beiden fällen die richtige merhode aufrufen
    const obs = this.isUpdatingAppointment
      ? this.nh.updateAppointment(params['subjectId'], params['courseId'], appointment)
      : this.nh.createAppointment(params['subjectId'], params['courseId'], appointment);
    obs.subscribe({
      next: (updatedAppointment: Appointment) => {
        this.saved.emit(updatedAppointment); // parent benachrichtigen, dass gespeichert
        this.appointmentForm.reset(AppointmentFactory.empty());
        this.toastr.success('Termin erfolgreich gespeichert', 'Nachhilfe25');
        const params = this.route.snapshot.params;
        // navigiert auf andere seite ohne url zu ändern und dann zurück bei add und edit methoden, da troubles mit reload
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/subjects', params["subjectId"], 'courses', params["courseId"]]);
        });
      },
      error: () => {
        this.toastr.error('Beim Speichern ist ein Fehler aufgetreten', 'Fehler');
      }
    });

  }


  // Datum konvertieren, um Backend-Format zu matchen, help from chatgpt, da sonst fehler aufgetreten sind
  // nimmt string im ISO-Format (z.B. "2025-05-02T14:30") entgegen
  private toBackendDateTime(isoString: string): string {
    // falls leer, dann leer zurückgeben, damit kein Fehler auftritt
    if (!isoString) return '';
    // aus ISO-String wird ein Date-Objekt erzeugt
    const date = new Date(isoString);
    // kleine Hilfsfunktion, die eine Zahl in einen String umwandelt und sicherstellt, dass sie mindestens 2 Stellen hat, aus 5 wird 05
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }



}

