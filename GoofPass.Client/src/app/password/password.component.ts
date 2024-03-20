import {Component, OnInit} from '@angular/core';
import {PasswordEntryDto} from "../shared/dtos/passwordEntryDto";
import {Router} from "@angular/router";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {PasswordCreateComponent} from "../password-create/password-create.component";
import {PasswordService} from "../shared/password.service";
import {User} from "../shared/dtos/user.dto";
import {SecurityService} from "../shared/security.service";

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    PasswordCreateComponent,
    AsyncPipe
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent implements OnInit {
  constructor(private router: Router, private passwordService: PasswordService, private securityService: SecurityService) {
  }

  passwordEntries: PasswordEntryDto[] = [];
  user: User = JSON.parse(localStorage.getItem('user')!) as User;
  key: string = localStorage.getItem('key')!;


  ngOnInit(): void {
    this.passwordService.getPasswords(this.user).subscribe({
      next: (passwords) => {
        this.passwordEntries = passwords;
      },
      error: (err) => {
        console.error('Could not fetch passwords');
      }
    });
  }

  // addPassword(item: PasswordEntryDto) {
  //   this.passwordEntries.push(item);
  // }

  redirectToNewPage() {
    this.router.navigate(['password/create']); // Adjust the route according to your application
  }

  revealPassword(entry: PasswordEntryDto) {
    this.securityService.decrypt(entry, this.key)
      .then((decrypted) => {
        entry.plain = decrypted;
      })
      .catch((err) => {
        console.error('Could not decrypt password entry');
      }
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']); // Adjust the route according to your application
  }
}
