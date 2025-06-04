import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';

interface Token {
  exp: number;
  user: {
    id: number;
    role: string;
    firstname: string;
    lastname: string;
    email: string;
    education: string;
    telephone: string;
    avatar: string;
  }
}
@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private api = "http://nachhilfe25.s2210456017.student.kwmhgb.at/api/auth"

  constructor(
    // mit dependency injection den http client holen
    private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post(`${this.api}/login`, {email, password});
  }

  logout () {
    this.http.post(`${this.api}/logout`, {})
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }


  // prüft, ob Token im sessionStorage liegt und ob es gültig (nicht abgelaufen) ist
  // methode genau aus übung
  public isLoggedIn(): boolean {
    if(sessionStorage.getItem("token")){
      let token: string = <string>sessionStorage.getItem("token");
      // checken ob token abgelaufen ist, zuerst decoden
      const decodedToken = jwtDecode(token) as Token;
      let expirationDate = new Date(0);
      // setzt die zeit auf 0  also 1970 jahr und added dann die seconds auf die expiration date
      expirationDate.setUTCSeconds(decodedToken.exp);
      // wenn token abgelaufen
      if(expirationDate < new Date()) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  // gibt user zurück, falls kein user da ist, fallback werte damit nicht abstürzt
  getCurrentUser() {
    const user = JSON.parse(sessionStorage.getItem("user") || '{}');
    return {
      id: user.id || -1,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email : user.email,
      education: user.education || 'Keine Angabe',
      telephone: user.telephone || 'Unknown',
      avatar: user.avatar,
    };
  }


  // extrahiert User-Daten aus token und speichert alles im sessionStorage
  setSessionStorage(access_token: string) {
    const decodedToken = jwtDecode(access_token) as Token;
    const user = {
      id: decodedToken.user.id,
      role: decodedToken.user.role,
      firstName: decodedToken.user.firstname,
      lastName: decodedToken.user.lastname,
      email: decodedToken.user.email,
      education: decodedToken.user.education,
      telephone: decodedToken.user.telephone,
      avatar: decodedToken.user.avatar,
    };
    sessionStorage.setItem("token", access_token);
    sessionStorage.setItem("user", JSON.stringify(user));

  }

  isTeacher() {
    if(this.isLoggedIn()) {
      const user = this.getCurrentUser();
      if (user.role === 'teacher') {
        return true;
      }
    }
    return false;
  }
}
