import {Component, inject} from '@angular/core';
import {CanActivateFn, Router, RouterOutlet} from '@angular/router';
import {PasswordComponent} from "./password/password.component";
import {NgIf} from "@angular/common";
import {AuthService} from "./auth/auth.service";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {AuthUserDto} from "./shared/dtos/authuser.dto";
import {User} from "./shared/dtos/user.dto";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PasswordComponent, NgIf, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  user: User | undefined;
}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).authenticated() ? true : inject(Router).parseUrl('/login');
};
