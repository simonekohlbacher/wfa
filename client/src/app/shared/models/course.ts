import {User} from './user';
import {Subject} from './subject';
import {Appointment} from './appointment';

export class Course {
  constructor(public id:number,
              public title:string,
              public teacher:User,
              public subject:Subject, // subject gespeichert für leichtere abfragen, weil immer geschachtelt
              public appointments?:Appointment[],
              public description?:string) {
  }
}
