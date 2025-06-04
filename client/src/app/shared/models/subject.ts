import {Course} from './course';
import { User } from './user';
export {Course} from './course';


export class Subject {
  constructor(public id:number,
              public title:string,
              public teacher_id:number,
              public courses:Course[],
              // teacher mitgespeichert für leichtere Anzeige, zB in subject detail
              public teacher:User | null,
              public description?:string) {
  }
}
