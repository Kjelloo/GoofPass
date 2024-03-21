import {Routes} from '@angular/router';
import {PasswordComponent} from "./password/password.component";
import {authGuard} from "./app.component";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {PasswordCreateComponent} from "./password-create/password-create.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'password', component: PasswordComponent, canActivate: [authGuard]},
  {path: 'password/create', component: PasswordCreateComponent, canActivate: [authGuard]},
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
];
