import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthUserDto} from "../shared/dtos/authuser.dto";
import {User} from "../shared/dtos/user.dto";
import {Observable, of} from "rxjs";
import {RegisterUserDto} from "../shared/dtos/RegisterUserDto";
import {UserBareDto} from "../shared/dtos/UserBareDto";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(user: AuthUserDto): Observable<User> {
    return this.http.post<User>(environment.apiUrl + 'User/Login', user);
  }

  register(user: RegisterUserDto) {
    return this.http.post(environment.apiUrl + 'User/Register', user);
  }

  validateToken(token: string) {
    return this.http.post<boolean>(environment.apiUrl + 'User/ValidateToken/' + token, null);
  }

  getSalt(user: UserBareDto): Observable<string> {

    return this.http.post(
      environment.apiUrl + 'User/Salt',
      user,
      {responseType: 'text'});
  }

  authenticated() {
    const user = JSON.parse(localStorage.getItem('user')!) as User;

    if (user == undefined || user.token == undefined || user.token == '') {
      return of(false);
    }

    return this.validateToken(user.token);
  }
}
