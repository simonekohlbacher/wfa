import {User} from './user';
import {Appointment} from './appointment';

export class Registration {
  constructor(public id:number,
              public status:string,
              public status_label: string,
              public student:User,
              public student_id:number,
              public appointment:Appointment,
              public appointment_id:number,
              public comment?:string,
             ) {
  }
}
