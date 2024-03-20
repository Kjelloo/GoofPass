import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {PasswordEntryDto} from "./dtos/passwordEntryDto";
import {User} from "./dtos/user.dto";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) { }

  createPassword(password: PasswordEntryDto) {
    return this.http.post<PasswordEntryDto>(environment.apiUrl + 'Password', password);
  }

  getPasswords(user: User) {
    return this.http.get<PasswordEntryDto[]>(environment.apiUrl + 'Password/User/' + user.id);
  }
}
