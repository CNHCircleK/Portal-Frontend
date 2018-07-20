import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Mrf } from '@core/data/mrf';
import { DataService } from '@core/data/data.service';

@Injectable( { providedIn: 'root' })
export class MrfnavResolver implements Resolve<Mrf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf[]> {
		let data: Mrf[];
		return this.dataService.getMrfs();

		// if(!Array.isArray(data))	// Mrfs haven't been loaded. Note, "!data" doesn't work because the empty array returns false
		// {
		// 	this.router.navigate(['/']);
		// 	return null;
		// }
	}
}

@Injectable( { providedIn: 'root' })
export class MrfResolver implements Resolve<Mrf> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf> {
		let data: Mrf;
		return this.dataService.getMrf(route.params.id).pipe(map(
			mrf => {
				if(!mrf){
					this.router.navigate(['/mrfs']);
					return null;
				}
				return mrf;
		}));

		// if(!Array.isArray(data))	// Mrfs haven't been loaded. Note, "!data" doesn't work because the empty array returns false
		// {
		// 	this.router.navigate(['/']);
		// 	return null;
		// }
	}
}