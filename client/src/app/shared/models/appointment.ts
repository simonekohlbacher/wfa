import {Course} from './course';

export class Appointment {
  constructor(
    public id: number,
    public course: Course | null,
    public start_at: Date | null,
    public end_at: Date | null,
    public status: string,
    public price: number,
    public course_id: number,
  ) {}


}
