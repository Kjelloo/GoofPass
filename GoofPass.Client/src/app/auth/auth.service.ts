import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthUserDto} from "../shared/dtos/authuser.dto";
import {environment} from "../../environments/environment.development";
import {User} from "../shared/dtos/user.dto";
import {Observable} from "rxjs";
import {RegisterUserDto} from "../shared/dtos/RegisterUserDto";
import {UserBareDto} from "../shared/dtos/UserBareDto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(user: AuthUserDto): Observable<User> {
    return this.http.post<User>(environment.apiUrl + 'User/Login', user);
  }

  register(user: RegisterUserDto) {
    return this.http.post(environment.apiUrl + 'User/Register', user);
  }

  getSalt(user: UserBareDto): Observable<string> {

    return this.http.post(
      environment.apiUrl + 'User/Salt',
      user,
      { responseType: 'text'});
  }

  authenticated() {
    const user = JSON.parse(localStorage.getItem('user')!) as User;
    return user != undefined && user.token != undefined && user.token != '';
  }
}
