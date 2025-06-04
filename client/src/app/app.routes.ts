import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SubjectListComponent} from './subject-list/subject-list.component';
import {SubjectDetailsComponent} from './subject-details/subject-detail.component';
import {CourseDetailsComponent} from './course-detail/course-detail.component';
import {RegistrationListComponent} from './registration-list/registration-list.component';
import {LoginComponent} from './login/login.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {RegistrationDetailsComponent} from './registration-detail/registration-detail.component';
import { canNavigateToRegistrationsGuard } from './can-navigate-to-registration-guard.guard';

export const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},  // muss genau / sein
  {path:'home', component: HomeComponent},
  {path:'subjects', component: SubjectListComponent},
  {path:'subjects/:subjectId', component: SubjectDetailsComponent},
  {path:'subjects/:subjectId/courses/:courseId', component: CourseDetailsComponent},
  {path:'registrations', component: RegistrationListComponent, canActivate:[canNavigateToRegistrationsGuard]},
  {path:'registrations/:id', component: RegistrationDetailsComponent, canActivate:[canNavigateToRegistrationsGuard]},
  {path:'login', component: LoginComponent},
  // Letzte Stelle 404s, kein passendes route muster gefunden
  { path:'**', component: NotFoundComponent }
];


