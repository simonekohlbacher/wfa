import {Appointment} from './models/appointment';

export class AppointmentFactory {
  static empty(): Appointment {
    return new Appointment(0, null, null, null, 'available', 0, 0);
  }

  static fromObject(raw: any): Appointment {
    return new Appointment(
      raw.id,
      raw.course ?? null,
      raw.start_at ?? null,
      raw.end_at ?? null,
      raw.status,
      raw.price,
      raw.course_id,
    );
  }


}
