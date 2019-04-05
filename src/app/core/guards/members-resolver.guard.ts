import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { MemberService } from '@core/services';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/models';


@Injectable( {providedIn: 'root'} )
export class MembersResolver implements Resolve<Member[]> {
	constructor(private memberService: MemberService, private router: Router) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Member[]> {
		return this.memberService.getMembers();
	}
}