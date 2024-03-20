import {Component, OnInit} from '@angular/core';
import {PasswordentryEncryptedDto} from "../shared/dtos/passwordentryencrypted.dto";
import {Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {PasswordCreateComponent} from "../password-create/password-create.component";

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    PasswordCreateComponent
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent implements OnInit {
  constructor(private router: Router) {
  }

  passwordEntries: PasswordentryEncryptedDto[] = [
    {
      name: 'Google',
      password: 'encryptedPassword1',
      id: undefined,
      userid: '',
      salt: '',
      iv: ''
    },
    {
      name: 'Facebook',
      password: 'encryptedPassword2',
      id: undefined,
      userid: '',
      salt: '',
      iv: ''
    }
  ];

  ngOnInit(): void {

  }

  addPassword(item: PasswordentryEncryptedDto) {
    this.passwordEntries.push(item);
  }

  redirectToNewPage() {
    this.router.navigate(['password/create']); // Adjust the route according to your application
  }

  revealPassword(entry: PasswordentryEncryptedDto) {
    // Implement logic to reveal password
    console.log(entry.password);
  }

}
