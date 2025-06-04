import {CanActivateFn, Router} from '@angular/router';
import {AuthenticationService} from "./shared/authentication.service";
import {inject} from "@angular/core";
export const canNavigateToRegistrationsGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    window.alert("Du musst dich einloggen, um Registrierung vorzunehmen und einzusehen.");
    router.navigate(["../login"]);
    return false;
  }
};
