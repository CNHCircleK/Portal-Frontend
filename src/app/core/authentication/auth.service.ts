import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, defaultIfEmpty } from 'rxjs/operators';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { DataService } from '@core/data/data.service';

import { Member } from './member';
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
      if(!this.decodeUser(localStorage.getItem(tokenName)))
        this.logout();  // logout if token is expired
    }
  }

  public login(user: string, password: string): Observable<boolean>  // Success or not in logging in
  {
    return this.http.post<any>( HttpConfig.baseUrl + "/signin", {'name': user, 'password': password}).pipe(
                map(res => {
                  if(res.success) {
                    localStorage.setItem(tokenName, res.result);
                    console.log(res.result);
                    // Do more stuff with the response
                    this.decodeUser(res.result);
                    // this.http.get( HttpConfig.baseUrl + '/clubs/5b498a5b200a8f6afa46c1d0/members').subscribe(res => {
                    //   console.log(res);
                    // })
                    this.loggedIn = true;
                  }
                  return res.success;
                }));
    // if(user != "user" || password != "pass")
    //   return of(false);
    // localStorage.setItem(tokenName, "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93cC5kcmFmdHNpdGUudGsiLCJpYXQiOjE1MzM1ODczOTgsIm5iZiI6MTUzMzU4NzM5OCwiZXhwIjoxNTMzNjczNzk4LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIyIn19fQ.KEnvHM_JKCFP-0ZIsWAG7zEPF3Kr7HXGnqJqUu8lZxA");
    // // Make sure the token is a valid token by trying to run a helper function on it first;
    // this.decodeUser(localStorage.getItem(tokenName));
    // return of(true);
  }

  public logout(): void {
    localStorage.removeItem(tokenName);
    this.loggedIn=false;
    this.user.next(undefined);
  }

  private decodeUser(token: string): boolean {
    // if(this.helper.isTokenExpired(token))  The whole app breaks since we're using a static token LOL
      // return false;
    let data;
    try {
      data = this.helper.decodeToken(token);
    } catch (error) {
      this.logout();
      console.log(error);
      throw error;
    }
    this.user.next(data);   // The token doesn't model the user yet
    console.log(data);
    // this.user.next({id: 1,
    //             name: "Chris",
    //             club_id: 5,
    //             division_id: 6,
    //             access: {
    //               club: 1,
    //               division: 0,
    //               district: 0
    //             }
    //           });
    return true;
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(tokenName);
    if (token != null && !this.helper.isTokenExpired(token))
      return true;
    localStorage.removeItem(tokenName);  // really feel like an is() function shouldn't be handling this
    this.user.next(null);
    return false;
  }

  public getUser(refresh?: boolean): Observable<Member> {
      return this.user.asObservable();
  }

  public getAccess() {
    /*
    tokenData = helper.decodeToken(mytoken);
    user._id = tokenData._id;
    */
    if(!this.loggedIn)
      return undefined;
    return this.user.value.access;
  }

  public setAccess(club: number,
    division: number,
    district: number) {
    let tempUser = this.user.value;
    tempUser.access.club = club;
    tempUser.access.division = division;
    tempUser.access.district = district;
    this.storage.setItem('auth', tempUser).subscribe(()=>{});
    this.user.next(tempUser);
  }


  public signup(code: string, email: string, user: string, pass: string): Observable<string> {
    let data = {
      registration: code,
      email: email,
      username: user,
      password: pass
    }
    return this.http.post<any>( HttpConfig.baseUrl + "/signup", data).pipe(map(res => res.token));
  }

/*
.subscribe( (data: Config) => { },
	(error) => { });

	private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
};

now in getConfig() in service, .pipe(catchError(this.handleError))
*/
}