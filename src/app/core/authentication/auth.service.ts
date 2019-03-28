import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, defaultIfEmpty } from 'rxjs/operators';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { DataService } from '@core/data/data.service';

import { Member } from '@core/models';
import { User } from '@core/models';
import HttpConfig from '@env/api_config';

export const tokenName = 'access_token';

@Injectable( {providedIn: 'root'} )
export class AuthService {
	private user = new BehaviorSubject<Member>(undefined); // ReplaySubject with buffer size 1 behaves like a BehaviorSubject,
                                                // except it emits nothing (not even null) until the first publish
  private loggedIn: boolean = localStorage.getItem(tokenName) != null;
  public navFromMrf: boolean;

  private helper: JwtHelperService;
  constructor(private http: HttpClient, private storage: LocalStorage) {
    this.helper = new JwtHelperService();
    if(this.isLoggedIn()) {  // persist login
      this.loadUserFromToken();
    }
  }

  public login(email: string, password: string): Observable<boolean>  // Success or not in logging in
  {
    return this.sendCredentials(email, password).pipe(map((res:any) => {
      if(res.success) {
        localStorage.setItem(tokenName, res.result);
        console.log(res.result);
        this.loadUserFromToken();
      }
      return res.success;
    }));
  }

  private sendCredentials(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(HttpConfig.baseUrl + "/signin", {'email': email, 'password': password});
  }

  private loadUserFromToken(): boolean {
    let data;
    let token = localStorage.getItem(tokenName);
    if(!token) return false;
    try {
      data = this.helper.decodeToken(token);
    } catch (error) {
      console.log(error);
      this.logout();
      throw error;
    }
    this.user.next(data);
    console.log(data);
    return true;
  }

  public logout(): void {
    localStorage.removeItem(tokenName);
    this.loggedIn=false;
    this.user.next(undefined);
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(tokenName);
    if (token != null && !this.helper.isTokenExpired(token))
      return true;
    else {
      this.logout();
      return false;
    }
  }

  public signup(code: string, email: string, pass: string): Observable<string> {
    const data = {
      registration: code,
      email: email,
      password: pass
    }
    return this.http.post<any>(HttpConfig.baseUrl + "/signup", data);
  }

  public getUserObservable(refresh?: boolean): Observable<Member> {
      return this.user.asObservable();
  }

  public getUser() {
    return this.user.getValue();
  }

  public getAccess() {
    if(!this.loggedIn)
      return undefined;
    return this.user.value.access;
  }
}