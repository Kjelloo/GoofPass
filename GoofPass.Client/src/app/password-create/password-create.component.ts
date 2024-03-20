import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PasswordentryEncryptedDto} from "../shared/dtos/passwordentryencrypted.dto";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SecurityService} from "../shared/security.service";
import {PasswordService} from "../shared/password.service";
import {Router} from "@angular/router";
import {CreatePasswordDto} from "../shared/dtos/createpassword.dto";
import {User} from "../shared/dtos/user.dto";

@Component({
  selector: 'app-password-create',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './password-create.component.html',
  styleUrl: './password-create.component.css'
})
export class PasswordCreateComponent implements OnInit {
  @Output() passwordCreated =
    new EventEmitter<PasswordentryEncryptedDto>();

  passwordForm: FormGroup;

  constructor(private securityService: SecurityService, private passwordService: PasswordService,
              private router: Router) {
    this.passwordForm = new FormGroup({
      name: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ),
      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      )
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      let passwordEntryForm = this.passwordForm.value as CreatePasswordDto;
      let key = localStorage.getItem('key');
      let user = JSON.parse(localStorage.getItem('user')!) as User;

      if (key === null) {
        console.error('Master key not found');
        return;
      }

      let passwordEntry: PasswordentryEncryptedDto = {
        name: passwordEntryForm.name,
        password: '',
        id: '',
        userid: user.id!,
        salt: '',
        iv: ''
      };

      this.securityService.encrypt(passwordEntryForm.password, key)
        .then(encrypted => {
          passwordEntry.password = encrypted.password;
          passwordEntry.iv = encrypted.iv;
          passwordEntry.salt = encrypted.salt;

          this.passwordService.createPassword(passwordEntry).subscribe(  {
            next: (result) => {
              if (result) {
                this.passwordCreated.emit(result);
                this.router.navigate(['/password']);
              }
            },
            error: (error) => {
              console.error(error);
            }
          });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
}
