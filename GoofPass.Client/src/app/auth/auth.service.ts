import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthUserDto} from "../shared/dtos/authuser.dto";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: AuthUserDto) {
    return this.http.post(environment.apiUrl + 'User/Login', user);
  }

  register(user: AuthUserDto) {
    return this.http.post(environment.apiUrl + 'User/Register', user);
  }
}
