import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, RoutesRecognized } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter, pairwise } from 'rxjs/operators';

import { Cerf } from '@core/data/cerf';
import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/authentication/auth.service';

@Injectable( { providedIn: 'root' })
export class CerfnavResolver implements Resolve<Cerf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf[]> {
		let data: Cerf[];
		return this.dataService.getCerfList();
	}
}

@Injectable( { providedIn: 'root' })
export class CerfResolver implements Resolve<Cerf> {
	constructor(private dataService: DataService, private auth: AuthService, private router: Router) {
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf> {
		this.router.events.pipe(filter(e => e instanceof RoutesRecognized), pairwise(), take(1)).subscribe((routes: any[]) => {
			this.auth.navFromMrf = routes[0].url.includes('/mrf/');
			console.log(routes);
		});
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