import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// fängt“ alle HTTP-Anfragen ab und hängt automatisch den JWT-Token aus dem sessionStorage als Authorization Header dran
export class TokenInterceptorService implements HttpInterceptor {

  constructor() {
  }


 // Methode intercept wird bei jedem HTTP-Request aufgerufen
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // erstellt eine Kopie der Request und fügt den Header Bearer <token> hinzu
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    // request an den next handler weitergeben
    return next.handle(req);
  }


}
