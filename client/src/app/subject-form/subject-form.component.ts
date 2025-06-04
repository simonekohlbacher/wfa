import {Component, OnInit, output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {SubjectFactory} from '../shared/subject-factory';
import {NachhilfeService} from '../shared/nachhilfe.service';
import {Subject} from '../shared/models/subject';
import {AuthenticationService} from '../shared/authentication.service';
import {FormErrorMessages} from '../shared/form-error-messages';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'nh-subject-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './subject-form.component.html',
  styles: ``
})
export class SubjectFormComponent implements OnInit{
  subjectForm : FormGroup;
  isUpdatingSubject: boolean = false;
  subject = SubjectFactory.empty();
  errors:{[key:string]:string} ={};
  courses : FormArray;
  // wird gefeuert wenn Formular gespeichert wurde
  saved = output<any>();

  constructor(
    private fb:FormBuilder,
    private nh:NachhilfeService,
    private route:ActivatedRoute,
    private authService:AuthenticationService,
    private toastr:ToastrService
    ) {
    this.subjectForm = this.fb.group({});
    this.courses = this.fb.array([]);
  }

  ngOnInit() {
    const id = this.route.snapshot.params["subjectId"];
    if(id){
      // update subject
      this.isUpdatingSubject = true;
      // ausgewähltes subject von server holen
      this.nh.getSingleSubject(id).subscribe(subject =>{
        this.subject = subject;
        this.initSubject();
      });
    }
      this.initSubject();
  }


initSubject(){
  this.buildCourseArray();
  this.subjectForm = this.fb.group({
    id: this.subject.id,
    title: [this.subject.title,
      [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
      ]
    ],
    teacher_id: this.getCurrentUser().id,
    courses: this.courses,
    teacher: this.getCurrentUser(),
    description: [this.subject.description],
  });
  // auf fehler reagieren
    this.subjectForm.statusChanges.subscribe(()=>{
      this.updateErrorMessages();
    })
  }

  private buildCourseArray() {
    // wenn schon kurse da, dann füge sie ein
    if(this.subject.courses){
      // leeres FormArray anlegen
      this.courses = this.fb.array([]);
      // jeden kurs in das FormArray einfügen, also formgroups anlegen
      for(let course of this.subject.courses){
        this.courses.push(this.fb.group({
          id: course.id,
          title: [course.title,
            [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(50)
            ]
          ],
          subject_id: [this.subject.id],
          teacher: this.getCurrentUser(),
          description: [course.description],
        }));
      }
      // für neues subject, da noch keine kurse vorhanden
      if(this.subject.courses.length == 0){
        this.addMoreCourses();
      }
    }
  }

  // erstellt ein neues FormGroup für einen kurs
  addMoreCourses() {
    this.courses.push(this.fb.group({
      // id wird von DB generiert
      title: [''],
      subject_id: [this.subject.id],
      teacher_id: [this.getCurrentUser().id],
      description: ['']
    }));
  }


  updateErrorMessages(){
    this.errors = {};
    for(const message of FormErrorMessages){
      const control = this.subjectForm.get(message.forControl);
      if(control && control.dirty && control.invalid && control.errors &&
        control.errors[message.forValidator] && !control.errors[message.forControl]){
        this.errors[message.forControl] = message.text;
      }
    }
  }


  submitForm() {
    // formulardaten auslesen
    const rawValue = this.subjectForm.value;
    // filtert leere Kurse raus, also Kurse ohne Titel, von chatgpt
    const filteredCourses = rawValue.courses.filter((course: any) => course.title && course.title.trim() !== '');

    // subject zum speichern vorbereiten
    const subjectToSave = {
      ...rawValue,
      courses: filteredCourses
    };
    const subject: Subject = SubjectFactory.fromObject(subjectToSave);

    // je nach abfrage ob es update oder create ist die methode vom service aufrufen
    const request$ = this.isUpdatingSubject
      ? this.nh.updateSubject(subject)
      : this.nh.createSubject(subject);
    request$.subscribe(() => {
      // in beiden fällen
      this.saved.emit(subject); // parent benachrichtigen, zB subject list und die ruft dann neuladen der subjects auf
      this.subjectForm.reset(SubjectFactory.empty());
      this.subject = SubjectFactory.empty();
      this.toastr.success('Kurs erfolgreich gespeichert', 'Nachhilfe25');
    });
  }


  getCurrentUser () {
    return this.authService.getCurrentUser();
  }

}
