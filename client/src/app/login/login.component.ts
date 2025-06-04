import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../shared/authentication.service';
import {RoleLabelPipe} from '../shared/userRole.pipe';
import {FormErrorMessages} from '../shared/form-error-messages';
import {ToastrService} from 'ngx-toastr';

interface Response {
  access_token: string;
}

@Component({
  selector: 'nh-login',
  imports: [
    ReactiveFormsModule,
    RoleLabelPipe,
  ],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit{
  // form group type for login form
  loginForm:FormGroup;
  errors: { [key: string]: string } = {};

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private authService: AuthenticationService,
    private toastr: ToastrService
    ){
   // loginForm als empty FormGroup initialisieren
    this.loginForm = this.fb.group({});
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      // regex form chatgpt
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
    // auf statusChanges des Formulars hören
    this.loginForm.statusChanges.subscribe(() => {
      this.updateErrorMessages();
    });
  }

  updateErrorMessages(){
    this.errors = {};
    // messages aus FormErrorMessages in errors Objekt holen
    for(const message of FormErrorMessages){
      // holt sich formularfeld aus dem loginForm, das zur aktuellen Fehlermeldung passt zB email
      const control = this.loginForm.get(message.forControl);
      // wenn feld schon berührt, invalid, exists, konkreter fehler und kein doppelter fehler
      if(control && control.dirty && control.invalid && control.errors &&
        control.errors[message.forValidator] && !control.errors[message.forControl]){
        // passende fehlermeldung in errors Objekt speichern
        this.errors[message.forControl] = message.text;
      }
    }
  }

  login () {
    // daten aus formular holen
    const value = this.loginForm.value;
    // authservice methode
    this.authService.login(value.email, value.password).subscribe({
      next: (res: any) => {
        // token in sessionStorage speichern
        this.authService.setSessionStorage((res as Response).access_token);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errors['login'] = 'Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Logout erfolgreich!',"Nachhilfe25");
    this.router.navigate(['/home']);

  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }


}
