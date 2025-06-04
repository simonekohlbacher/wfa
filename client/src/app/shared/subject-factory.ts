import {Subject} from './models/subject';

export class SubjectFactory {
  static empty() : Subject {
    return new Subject(0, "", 0, [], null, "");
  }

  static fromObject(raw: any): Subject {
    return new Subject(
      raw.id,
      raw.title,
      raw.teacher_id,
      raw.courses ?? [],  // wenn null oder undefined leeres Array
      raw.teacher ?? null,
      raw.description,
    );
  }
}
