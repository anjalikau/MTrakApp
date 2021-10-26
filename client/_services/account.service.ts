import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Console } from 'node:console';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if(user) {
          //console.log(user);
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          //console.log(this.decodedToken);
          //this.currentUser = user.user;
        }
        //return user;
      })
    );
  }  

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout() {
    // localStorage.removeItem('user');
    // localStorage.removeItem('token');
    localStorage.clear();
    this.currentUserSource.next(null);
  }

  
}
