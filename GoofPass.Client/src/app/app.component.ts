import {Component, inject} from '@angular/core';
import {CanActivateFn, RouterOutlet} from '@angular/router';
import {PasswordComponent} from "./password/password.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {AuthService} from "./auth/auth.service";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {map} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PasswordComponent, NgIf, LoginComponent, RegisterComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor() {
  }

}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).authenticated().pipe(
    map((auth) => {
        return auth;
      }
    ));
};
