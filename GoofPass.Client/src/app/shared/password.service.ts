import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PasswordEntryDto} from "./dtos/passwordEntryDto";
import {User} from "./dtos/user.dto";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) {
  }

  createPassword(password: PasswordEntryDto) {
    return this.http.post<PasswordEntryDto>(environment.apiUrl + 'Password', password);
  }

  getPasswords(user: User) {
    return this.http.get<PasswordEntryDto[]>(environment.apiUrl + 'Password/User/' + user.id);
  }
}
