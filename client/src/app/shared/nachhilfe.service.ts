import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {Course, Subject} from './models/subject';
import {Registration} from './models/registration';
import {Appointment} from './models/appointment';

// dependency injection, service ist in root verfügbar, also global
@Injectable({
  providedIn: 'root'
})
export class NachhilfeService {
  private api = "http://nachhilfe25.s2210456017.student.kwmhgb.at/api"

  constructor(private http: HttpClient) {
  }

  // Subjects
  getAllSubjects(): Observable<Array<Subject>> {
    return this.http.get<Array<Subject>>(`${this.api}/subjects`);
  }

  getSingleSubject(subjectId: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.api}/subjects/${subjectId}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getCoursesForSubject(subjectId: number): Observable<Array<Course>> {
    return this.http.get<Array<Course>>(`${this.api}/subjects/${subjectId}/courses`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  createSubject(subject: Subject) : Observable<any> {
    return this.http.post(`${this.api}/subjects`, subject)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  updateSubject(subject: Subject): Observable<any> {
    return this.http.put(`${this.api}/subjects/${subject.id}`, subject)
      .pipe(retry(3), catchError(this.errorHandler));
  }

  deleteSubject(subjectId: number): Observable<Subject> {
    return this.http.delete<any>(`${this.api}/subjects/${subjectId}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }


  // Courses
  getSingleCourse(subjectId: number, courseId: number): Observable<Course> {
    return this.http.get<Course>(`${this.api}/subjects/${subjectId}/courses/${courseId}`)
  }

  deleteCourse(subjectId: number, courseId: number) : Observable<Course> {
    return this.http.delete<any>(`${this.api}/subjects/${subjectId}/courses/${courseId}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }


  // Appointments
  getAllAppointmentsForCourse(subjectId: number, courseId: number) : Observable<Array<Appointment>> {
    return this.http.get<Array<Appointment>>(`${this.api}/subjects/${subjectId}/courses/${courseId}/appointments`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getSingleAppointment(subjectId: number, courseId: number, id: number) {
    return this.http.get(`${this.api}/subjects/${subjectId}/courses/${courseId}/appointments/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  createAppointment(subjectId: number, courseId: number, appointment: Appointment) : Observable<any> {
    return this.http.post(`${this.api}/subjects/${subjectId}/courses/${courseId}/appointments`, appointment)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  updateAppointment(subjectId: number, courseId: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.api}/subjects/${subjectId}/courses/${courseId}/appointments/${appointment.id}`, appointment)
      .pipe(retry(3), catchError(this.errorHandler));
  }

  deleteAppointment(subjectId: number, courseId: string, id: number) {
    return this.http.delete(`${this.api}/subjects/${subjectId}/courses/${courseId}/appointments/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }


  // Registrations
  getAllRegistrations() : Observable<Array<Registration>> {
    return this.http.get<Array<Registration>>(`${this.api}/registrations`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getSingleRegistration(id: number) : Observable<Registration> {
    return this.http.get<Registration>(`${this.api}/registrations/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  registerForAppointment(registration: Registration) : Observable<Registration> {
    return this.http.post<any>(`${this.api}/registrations`, registration)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  updateRegistrationStatus(registration: Registration) {
    return this.http.put(`${this.api}/registrations/${registration.id}`, registration)
    .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }


  // Error Handling
  private errorHandler(error: Error | any): Observable<any> { return throwError(error); }

}
