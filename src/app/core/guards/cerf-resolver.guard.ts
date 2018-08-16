import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, RoutesRecognized } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter, pairwise, catchError } from 'rxjs/operators';

import { Cerf } from '@core/data/cerf';
import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/authentication/auth.service';

@Injectable( { providedIn: 'root' })
export class MyCerfsResolver implements Resolve<Cerf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf[]> {
		return this.dataService.getMyCerfList().pipe(catchError(err => {
			console.log("Error retrieving data");
			return of([]);
		}));
	}
}

@Injectable( { providedIn: 'root' })
export class CerfResolver implements Resolve<Cerf> {
	constructor(private dataService: DataService, private auth: AuthService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf> {
		if(route.params.id=='new')
			return of(this.dataService.newCerf());
		return this.dataService.getCerfById(route.params.id).pipe(map(
			cerf => {
				if(!cerf){
					this.router.navigate(['/cerfs']);
					return null;
				}
				return cerf;
		}));
	}
}