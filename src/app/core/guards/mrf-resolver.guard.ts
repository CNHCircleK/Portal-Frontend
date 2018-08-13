import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter, pairwise } from 'rxjs/operators';

import { Mrf } from '@core/data/mrf';
import { DataService } from '@core/data/data.service';

@Injectable( { providedIn: 'root' })
export class MrfSecretaryResolver implements Resolve<Mrf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf[]> {
		return this.dataService.getMrfList();
	}
}
@Injectable( { providedIn: 'root' })
export class MrfDivisionResolver implements Resolve<Mrf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf[]> {
		return this.dataService.getMrfList();	// get division mrfs
	}
}
@Injectable( { providedIn: 'root' })
export class MrfDistrictResolver implements Resolve<Mrf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf[]> {
		return this.dataService.getMrfList();	// get district mrfs
	}
}

@Injectable( { providedIn: 'root' })
export class MrfResolver implements Resolve<Mrf> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf> {
		return this.dataService.getMrfById(route.params.id).pipe(map(mrf => {
				if(!mrf){
					this.router.navigate(['/mrfs']);
					return null;
				}
				return mrf;
		}));
	}
}