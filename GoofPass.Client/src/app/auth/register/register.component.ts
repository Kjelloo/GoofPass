import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {AuthService} from "../auth.service";
import {Router, RouterLink} from "@angular/router";
import {AuthUserDto} from "../../shared/dtos/authuser.dto";
import {SecurityService} from "../../shared/security.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private securityService: SecurityService) {
    this.registerForm = new FormGroup({
      email: new FormControl(
        '',
        [
          Validators.required,
          Validators.email
        ]
      ),
      password: new FormControl(
        '', [
          Validators.required,
          Validators.minLength(8)
        ]
      ),
    });
  }

  ngOnInit(): void {

  }

  register() {
    if (this.registerForm.valid) {
      let userLogin = this.registerForm.value as AuthUserDto;
      localStorage.clear();

      let user = this.securityService.createUser(userLogin);

      user.then((user) => {
        this.authService.register(user).subscribe({
          next: (user) => {
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Could not register');
          }
        });
      });
    }
  }

  get email() {
    return this.registerForm.get('email')
  }

  get password() {
    return this.registerForm.get('password')
  }

}
