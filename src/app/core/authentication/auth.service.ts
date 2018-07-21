import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, defaultIfEmpty } from 'rxjs/operators';

import { LocalStorage } from '@ngx-pwa/local-storage';

export interface Member {
  id: number,
  name: string,
  club_id: number,
  division_id: number,
  access?: {
    club: number,
    division: number,
    district: number
  }
}

export const tokenName = 'access_token';

@Injectable( {providedIn: 'root'} )
export class AuthService {
	private user = new BehaviorSubject<Member>(undefined); // ReplaySubject with buffer size 1 behaves like a BehaviorSubject,
                                                // except it emits nothing (not even null) until the first publish
  private loggedIn: boolean = localStorage.getItem(tokenName) != null;
  public navFromMrf: boolean;
  

  constructor(private http: HttpClient, private storage: LocalStorage) {

    
  }

  private loadUser(): Observable<Member> {
    return this.storage.getItem('auth').pipe(map(user => {
      if(user) {
        this.user.next(user);
      }
      else{
        this.user.next({
                        id: 1,
                        name: "Chris",
                        club_id: 71230,
                        division_id: 4,
                        access: {
                          club: 2,
                          division: 0,
                          district: 0
                        }
                      });
      }
      this.loggedIn=true;
      localStorage.setItem(tokenName, "loggedintoken");
      return this.user.value;
    }));

  }

  public getUser(refresh?: boolean): Observable<Member> {
    // if(!this.loggedIn)
    //   this.fetchUser();
    if(this.loggedIn)
      this.login("user", "pass").subscribe(success => this.user.asObservable());  // persist login
    return this.user.asObservable();
  }

  public login(user: string, password: string): Observable<boolean>  // Success or not in logging in
  {
    // return this.http.post<any>('/login', {user, password}).pipe(
    //             map(res => {
    //               if(res.success) {
    //                 localStorage.setItem(tokenName, res.auth_token);
    //                 // Do more stuff with the response
    //                 // this.user.next(res.user);
    //                 this.loggedIn = true;
    //               }
    //               return res.success;
    //             }));
    return this.storage.getItem('auth').pipe(map(user => {
      if(user) {
        this.user.next(user);
      }
      else{
        this.user.next({
                        id: 1,
                        name: "Chris",
                        club_id: 71230,
                        division_id: 4,
                        access: {
                          club: 2,
                          division: 0,
                          district: 0
                        }
                      });
      }
      this.loggedIn=true;
      localStorage.setItem(tokenName, "loggedintoken");
      return true;
    }));
  }

  public logout(): void {
    localStorage.removeItem(tokenName);
    this.loggedIn=false;
    this.user.next(undefined);
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem(tokenName) != null;
  }

  public getAccess() {
    if(!this.loggedIn)
      return undefined;
    return this.user.value.access;
  }

  setAccess(club: number,
    division: number,
    district: number) {
    let tempUser = this.user.value;
    tempUser.access.club = club;
    tempUser.access.division = division;
    tempUser.access.district = district;
    this.storage.setItem('auth', tempUser).subscribe(()=>{});
    this.user.next(tempUser);
  }

// getConfig() {
//   // now returns an Observable of Config
//   return this.http.get<Config>(this.configUrl);
// }

// 	getConfigResponse(): Observable<HttpResponse<Config>> {
//   return this.http.get<Config>(
//     this.configUrl, { observe: 'response' });
// }


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