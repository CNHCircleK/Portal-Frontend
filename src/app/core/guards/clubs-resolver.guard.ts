import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@core/services';
import { AuthService } from '@core/authentication/auth.service';


@Injectable( {providedIn: 'root'} )
export class ClubsResolver implements Resolve<string[]> {
	constructor(private apiService: ApiService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
		return this.apiService.getClubs().pipe(map(res => {
			if(!res) {
				console.log(res);
				this.router.navigate(['']);
				return null;
			}
			return res;
		}));
	}
}