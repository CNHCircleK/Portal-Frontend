import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, RoutesRecognized } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter, pairwise, catchError, tap } from 'rxjs/operators';

import { Cerf } from '@core/data/cerf';
import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/authentication/auth.service';

@Injectable( { providedIn: 'root' })
export class MyCerfsResolver implements Resolve<Cerf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf[]> {
		return this.dataService.getMyCerfList().pipe(map(res => {
			if(res['success'])
				return res['result'];
			return null;
		}),
		catchError(err => {
			console.log("Error retrieving data");
			return of([]);
		}),
		tap(res => this.dataService.routeMrf = false));
	}
}

@Injectable( { providedIn: 'root' })
export class CerfResolver implements Resolve<Cerf> {
	constructor(private dataService: DataService, private auth: AuthService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf> {
		if(route.params.id=='new')
			return of(this.dataService.blankCerf());
		return this.dataService.getCerf(route.params.id).pipe(map(
			(res: {success: boolean, result}) => {
				if(!res.success){
					this.router.navigate(['/cerfs']);
					return null;
				}
				return res.result;
		}));
	}
}

@Injectable( { providedIn: 'root' })
export class CerfNavResolver implements Resolve<boolean> {
	constructor(private dataService: DataService, private auth: AuthService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.dataService.isRouteMrf;
	}
}