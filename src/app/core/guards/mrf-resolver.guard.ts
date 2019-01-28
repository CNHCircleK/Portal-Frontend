import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter, pairwise, tap } from 'rxjs/operators';

import { Mrf } from '@core/data/mrf';
import { Cerf } from '@core/data/cerf';
import { DataService } from '@core/data/data.service';

@Injectable( { providedIn: 'root' })
export class MrfSecretaryResolver implements Resolve<Mrf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mrf[]> {
		return this.dataService.getMrfList();
	}
}
@Injectable( { providedIn: 'root' })
export class MrfPendingCerfResolver implements Resolve<Cerf[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cerf[]> {
		return this.dataService.getPendingCerfs().pipe(map(response => {
			console.log(response);
			if(response.success)
				return response.result;
			return [];
		}));
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
export class MrfResolver implements Resolve<any> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		return this.dataService.getMrfByDate(route.params.year, route.params.month).pipe(map(res => {
				if(!res.result){
					this.router.navigate(['/mrfs']);
					return null;
				}
				return res.result;
		}),
		tap(res => this.dataService.routeMrf = true));
	}
}