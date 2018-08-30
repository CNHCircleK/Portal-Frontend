import { Injectable } from '@angular/core';
import { CanDeactivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DataService } from '@core/data/data.service';

export interface CanComponentDeactivate {
	canDeactivate: () => Observable<boolean>|Promise<boolean>|boolean;
}

@Injectable( { providedIn: 'root' })
export class MrfDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
	private mrfUrl = new RegExp('/mrf/.*');
	private cerfUrl = new RegExp('/cerf/.*');

	constructor(private dataService: DataService) {}

	canDeactivate(component: CanComponentDeactivate, route: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot) {
		if(!nextState)
			return true;
		if(this.mrfUrl.test(currentState.url) && this.cerfUrl.test(nextState.url))
		{
			this.dataService.setMrfState(component);
		} else if(this.cerfUrl.test(currentState.url) && !this.mrfUrl.test(nextState.url)) {
			this.dataService.deleteMrfState();
		}
		return true;
	}
}