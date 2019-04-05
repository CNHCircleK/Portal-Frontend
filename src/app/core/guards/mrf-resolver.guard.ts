import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter, pairwise, tap } from 'rxjs/operators';

import { Cerf, Mrf } from '@core/models';
import { ApiService } from '@core/services';

@Injectable( { providedIn: 'root' })
export class MrfSecretaryResolver implements Resolve<Mrf[]> {
	constructor(private apiService: ApiService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf[]> {
		return this.apiService.getMrfList();
	}
}

// Move to CERF resolver
@Injectable( { providedIn: 'root' })
export class MrfPendingCerfResolver implements Resolve<Cerf[]> {
	constructor(private apiService: ApiService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf[]> {
		return this.apiService.getPendingCerfs().pipe(map(response => {
			console.log(response);
			if(response.success)
				return response.result;
			return [];
		}));
	}

}

@Injectable( { providedIn: 'root' })
export class MrfDivisionResolver implements Resolve<Mrf[]> {
	constructor(private apiService: ApiService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf[]> {
		return this.apiService.getMrfList();	// get division mrfs
	}
}
@Injectable( { providedIn: 'root' })
export class MrfDistrictResolver implements Resolve<Mrf[]> {
	constructor(private apiService: ApiService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf[]> {
		return this.apiService.getMrfList();	// get district mrfs
	}
}