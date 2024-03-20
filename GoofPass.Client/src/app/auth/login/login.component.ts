import { Component } from '@angular/core';
import {AuthUserDto} from "../../shared/dtos/authuser.dto";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {SecurityService} from "../../shared/security.service";
import {environment} from "../../../environments/environment.development";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private securityService: SecurityService) {
    this.loginForm = new FormGroup({
      email: new FormControl(
        '',
        [
          Validators.required,
          Validators.email
        ]
      ),
      password: new FormControl(
        '',
        Validators.required
      ),
    });
  }

  login() {
    if(this.loginForm.valid) {
      let userLogin = this.loginForm.value as AuthUserDto;
      // Get salt first (not the best way to do this, but it's a quick fix for now)
      this.authService.getSalt({email: userLogin.email}).subscribe({
        next: (salt) => {
          this.securityService.createKey(userLogin.password, salt, environment.iterAuth)
            .then((key) => {
              userLogin.password = key;
              this.authService.login(userLogin).subscribe({
                next: (user) => {
                  console.log(user);
                  if (user && user.token != undefined && user.token.length > 0){
                    localStorage.setItem('user', JSON.stringify(user));
                    this.securityService.createKey(userLogin.password, salt, environment.iterPw).then((masterKey) => {
                      localStorage.setItem('key', masterKey);
                      this.router.navigate(['password']);
                    });
                  }
                },
                error: (error) => {
                  console.error(error);
                }
              });
            });
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }



  get username() {return this.loginForm.get('username')}
  get password() {return this.loginForm.get('password')}
}
