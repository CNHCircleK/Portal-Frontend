import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, RoutesRecognized } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter, pairwise, catchError, tap } from 'rxjs/operators';

import { Cerf, Member } from '@core/models';
import { AuthService } from '@core/authentication/auth.service';
import { ApiService } from '@core/services';

@Injectable( { providedIn: 'root' })
export class MyCerfsResolver implements Resolve<Cerf[]> {
	constructor(private apiService: ApiService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf[]> {
		return this.apiService.getMyCerfList().pipe(map(res => {
			if(res['success'])
				return res['result'];
			return null;
		}),
		catchError(err => {
			console.log("Error retrieving data");
			return of([]);
		})  );//,
		// tap(res => this.apiService.routeMrf = false));
	}
}

@Injectable( { providedIn: 'root' })
export class CerfNavResolver implements Resolve<boolean> {
	constructor(private apiService: ApiService, private auth: AuthService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return true;//this.apiService.isRouteMrf;
	}
}