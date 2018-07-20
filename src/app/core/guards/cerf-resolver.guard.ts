import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Cerf } from '@core/data/cerf';
import { DataService } from '@core/data/data.service';

@Injectable( { providedIn: 'root' })
export class CerfnavResolver implements Resolve<Cerf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf[]> {
		let data: Cerf[];
		return this.dataService.getCerfList();

		// if(!Array.isArray(data))	// CERFs haven't been loaded. Note, "!data" doesn't work because the empty array returns false
		// {
		// 	this.router.navigate(['/']);
		// 	return null;
		// }
	}
}

@Injectable( { providedIn: 'root' })
export class CerfResolver implements Resolve<Cerf> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf> {
		let data: Cerf;
		return this.dataService.getCerf(route.params.id).pipe(map(
			cerf => {
				if(!cerf){
					this.router.navigate(['/cerfs']);
					return null;
				}
				return cerf;
		}));

		// if(!Array.isArray(data))	// CERFs haven't been loaded. Note, "!data" doesn't work because the empty array returns false
		// {
		// 	this.router.navigate(['/']);
		// 	return null;
		// }
	}
}