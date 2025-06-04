import {Component, OnInit, signal} from '@angular/core';
import {Subject} from '../shared/models/subject';
import {RouterLink} from '@angular/router';
import {SubjectListItemComponent} from '../subject-list-item/subject-list-item.component';
import {NachhilfeService} from '../shared/nachhilfe.service';
import {AuthenticationService} from '../shared/authentication.service';
import {SubjectFormComponent} from '../subject-form/subject-form.component';

@Component({
  selector: 'nh-subject-list',
  imports: [
    SubjectListItemComponent,
    RouterLink,
    SubjectFormComponent,
  ],
  templateUrl: './subject-list.component.html',
  styles: ``
})

export class SubjectListComponent implements OnInit{
  subjects = signal<Subject[]>([]);
  showForm: boolean = false;

  constructor(
    private nh:NachhilfeService,
    private authService:AuthenticationService) {
  }

  ngOnInit() {
    this.reloadSubjects();
  }

  // funktion aus ngOninit ausgelagert, damit sie auch von anderen Komponenten aufgerufen werden kann
  reloadSubjects() {
    this.nh.getAllSubjects().subscribe(res => this.subjects.set(res));
    this.showForm = false;
  }

  isTeacher() {
    return this.authService.isTeacher();
  }

  addSubject() {
    this.showForm = !this.showForm;
  }


}
