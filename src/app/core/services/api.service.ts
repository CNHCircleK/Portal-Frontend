import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, zip, forkJoin } from 'rxjs';
import { defaultIfEmpty, concatMap, map, tap, filter, catchError, first, last } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import HttpConfig from '@env/api_config';
import { Cerf, Mrf, User, Member } from '@core/models';
import { AuthService } from '@core/authentication/auth.service';
import * as moment from 'moment';

interface Response<T> {
  success: boolean,
  auth: boolean,
  error?: string,
  warnings?: string,
  result: T
}

// Any and all api calls go through here (except end-to-end authentication). Previously data.service.ts
// References: https://itnext.io/dont-clone-back-end-models-in-angular-f7a749bdc1b0
// 				https://medium.com/@joshblf/dynamic-nested-reactive-forms-in-angular-654c1d4a769a
@Injectable( {providedIn: 'root' })
export class ApiService {

	constructor(private http: HttpClient, private authService: AuthService) {
		this.user = authService.getUser();
	}

    user: Member;
    
	mrfState: Mrf;
	mrfFormState;
	mrfTabState: string;

	getCerf(id: string) {
		return this.http.get<Response<Cerf>>(HttpConfig.baseUrl + '/events/' + id);
	}
	getMyCerfList(): Observable<Cerf[]> {
		if(!this. user) return of(null);
		return this.http.get<any>(HttpConfig.baseUrl + '/members/' + this.user._id + '/events');
		// it is not the service's concern to clean up the data for the app to consume (e.g. reading 'success' or returning [])
	}
	getPendingCerfs() {
		if(!this.user) return of(null);
		let params = new HttpParams().set('status', '1');
		return this.http.get<any>(HttpConfig.baseUrl + '/clubs/' + this.user.club_id + '/events', { params: params } );
		// This returns all. Endpoint to get it for specific month? Or we can filter and split up, but inefficient
	}

	updateCerf(data: Cerf) {
		return this.http.patch(HttpConfig.baseUrl + "/events/" + data._id, data).pipe(tap(res => console.log(res)));;
		// TODO: cache-bust according to data._id
	}

	createNewCerf(data: Cerf) {
		return this.http.post(HttpConfig.baseUrl + "/events", data).pipe(tap(res => console.log(res)));
		// TODO: Special cache handler since the user will access this new cerf through its id
		// or leave it to refresh get requests again
	}

	changeCerfStatus(id: string, action: string) {
		if(action == "SUBMIT") {
			return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/submit", {submit: true}).pipe(tap(res => console.log(res)));
		} else if(action == "UNSUBMIT") {
			return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/submit", {submit: false}).pipe(tap(res => console.log(res)));
		} else if(action == "CONFIRM") {
			return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/confirm", {confirm: true}).pipe(tap(res => console.log(res)));
		} else if(action == "UNCONFIRM") {
			return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/confirm", {confirm: false}).pipe(tap(res => console.log(res)));
		}

		return of(null);
	}

	deleteCerf(id: string) {
		return this.http.delete(HttpConfig.baseUrl + "/events/" + id);
	}




	// just a simple array of month-year objects
	getMrfList(): Observable<Mrf[]> {
		const current = moment();
		const oldest = moment().month() > 5 ? moment().set('month', 5) : moment().subtract(1, 'year').set('month', 5);
		let list = [];
		while ((current > oldest || current.format('M') === oldest.format('M')) && list.length < 13) {
			list.push({ month: current.format('M'), year: current.format('YYYY') });
			current.subtract(1, 'month');
		}

		return of(list);
	}

	getMrfByDate(year: number, month: number) {
		return this.http.get(HttpConfig.baseUrl + "/clubs/" + this.user.club_id + "/mrfs/" + year + "/" + month);
	}

	updateMrf(data: Mrf) {
		if(!this.user) return of(null);
		return this.http.patch(HttpConfig.baseUrl + "/clubs/" + this.user.club_id + "/mrfs/" + data.year + "/" + data.month, data);
	}



	// Option 1: RouterReuseStrategy
	// Option 2: directly save inputted data when routing (this is more predicatable and explicit?)
	setMrfState(component) {
		this.mrfState = component.mrfForm.getRawValue();
		this.mrfFormState = component.mrfForm;
		this.mrfTabState = component.currentTab;
	}

	deleteMrfState() {
		this.mrfState = undefined;
		this.mrfFormState = undefined;
		this.mrfTabState = undefined;
	}

	get getMrfTabState() {
		if(this.mrfTabState) {
			return this.mrfTabState;
		}
		return "main";
	}

	get getMrfFormState() {
		if(this.mrfFormState)
			return this.mrfFormState;
	}



	fetchMembers() {
		if(!this.user) return of(null);
		return this.http.get<any>(HttpConfig.baseUrl + "/clubs/" + this.user.club_id + "/members");
	}

	addMember(first: string, last: string) {
		if(!this.user) return of(false);
		return this.http.post(HttpConfig.baseUrl + '/clubs/' + this.user.club_id + "/members", {name: {'first': first, 'last': last}});
	}

	getMemberCode(id: string) {
		return this.http.get<any>(HttpConfig.baseUrl + '/members/' + id + '/registration');
	}


	// Only usable by district secretary
	getDivisions() {
		return this.http.get(HttpConfig.baseUrl + "/divisions");
	}

	newDivision(name: string) {
		return this.http.post(HttpConfig.baseUrl + "/divisions", {'name': name});
	}

	deleteDivision(id: string) {
		return this.http.delete(HttpConfig.baseUrl + "/divisions/" + id);
	}




	getClubs(divisionId?: string) {
		if(!this.user) return of(null);
		if(!divisionId) divisionId=this.user.division_id;
		return this.http.get<any>(HttpConfig.baseUrl + "/divisions/" + divisionId + "/clubs");
	}

	newClub(name: string) {
		if(!this.user) return of(false);
		return this.http.post(HttpConfig.baseUrl + '/divisions/' + this.user.division_id + '/clubs', {'name': name});
	}

	deleteClub(id: string) {
		return this.http.delete(HttpConfig.baseUrl + '/clubs/' + id);
	}
}