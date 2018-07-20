import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Member {
  id: number,
  name: string,
  club_id: number,
  division_id: number,
  access?: {
    type: number,
    level: number
  }
}


@Injectable()
export class AuthService {
	private user = new BehaviorSubject<Member>(undefined); // ReplaySubject with buffer size 1 behaves like a BehaviorSubject,
                                                // except it emits nothing (not even null) until the first publish
  private loggedIn: boolean = false;

  constructor(private http: HttpClient) {

  }

  public getUser(): Observable<Member> {
    // if(!this.loggedIn)
    //   this.fetchUser();
    return this.user.asObservable();
  }

  public login(user: string, password: string): Observable<boolean>  // Success or not in logging in
  {
    return this.http.post<any>('/login', {user, password}).pipe(
                map(res => {
                  if(res.success) {
                    localStorage.setItem('auth_token', res.auth_token);
                    // Do more stuff with the response
                    // this.user.next(res.user);
                    this.loggedIn = true;
                  }
                  return res.success;
                }));
  }

  public logout(): void {
    localStorage.removeItem('auth_token');
    this.loggedIn=false;
    this.user.next(undefined);
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public getAccess() {
    if(!this.loggedIn)
      return undefined;
    return this.user.value.access;
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