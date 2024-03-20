import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {PasswordentryEncryptedDto} from "./dtos/passwordentryencrypted.dto";
import {User} from "./dtos/user.dto";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) { }

  createPassword(password: PasswordentryEncryptedDto) {
    console.log(password);
    return this.http.post<PasswordentryEncryptedDto>(environment.apiUrl + 'Password', password);
  }

  getPasswords(user: User) {
    return this.http.get<PasswordentryEncryptedDto[]>(environment.apiUrl + 'Password/' + user.id);
  }
}
