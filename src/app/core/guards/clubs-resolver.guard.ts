import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/authentication/auth.service';


@Injectable( {providedIn: 'root'} )
export class ClubsResolver implements Resolve<string[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string[]> {
		return this.dataService.getClubs().pipe(map(res => {
			if(!res) {
				console.log(res);
				this.router.navigate(['']);
				return null;
			}
			return res;
		}));
	}
}