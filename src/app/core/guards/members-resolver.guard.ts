import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';


@Injectable( {providedIn: 'root'} )
export class MembersResolver implements Resolve<Member[]> {
	constructor(private dataService: DataService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Member[]> {
		return this.dataService.getMembers().pipe(map(res => {
			if(!res.success) {
				this.router.navigate(['']);
				return null;
			}
			return res.result.map(member => ({...member, name: member.name.first + ' ' + member.name.last}));
		}));
	}
}