import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { Member } from '@core/models/member.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })	// the member roster will be used throughout the whole app
export class MemberService {
	
	roster: {name: string, email: string, _id: string}[];

	constructor(private apiService: ApiService) {
		this.getMembers().subscribe();
	}

	getMembers(clubId?: string): Observable<any> {  // stop caching in this service
		if(clubId) {
			return this.apiService.fetchMembers(clubId).pipe(map(response => {
				if(response && response.success) {
					this.roster = response.result.map(member => (
						{name: member.name.first + " " + member.name.last, email: member.email, _id: member._id}) );
					if(this.roster.length==0)
						this.roster = [{name: "None", email: "none", _id: ""}];
				}
				return this.roster;
			}
			));
		} else {
			// Default to user's own club
			if(this.roster)
				return of(this.roster);
			else
				return this.apiService.fetchMembers().pipe(map(response => {
					console.log(response);
					if(response && response.success) {
						this.roster = response.result.map(member => (
							{name: member.name.first + " " + member.name.last, email: member.email, _id: member._id}) );
						if(this.roster.length==0)
							this.roster = [{name: "None", email: "none", _id: ""}];
					}
					return this.roster;
				}
				));
		}
	}

	filterMembers(value: string) {
		if(!value)
		{
			value="";
		}
		if(this.roster===undefined)
		{
			// return this.getMembers().pipe(map(done => this.roster.filter(member => (member.name && member.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
			// 	|| (member.email && member.email.toLowerCase().indexOf(value.toLowerCase()) > -1)
			// 	)));
			return [];
		}
		return this.roster.filter(member => (member.name && member.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
			|| (member.email && member.email.toLowerCase().indexOf(value.toLowerCase()) > -1));
	}

	searchMember(value: string) {
		if(!value)
			return false;
		if(this.roster===undefined)
			return false;
		if(this.roster.map(member => member.name && member.name.toLowerCase()).indexOf(value.toLowerCase()) > -1)
			return true;
		return false;
	}

	getNameFromId(_id: string) {
		if(this.roster===undefined)
			return _id;
		const member = this.roster.find(member => member._id == _id);
		if(member)
			return member.name;
		else
			return _id;
	}

	newMember(firstName: string, lastName: string) {
		return this.apiService.addMember(firstName, lastName).pipe(tap((response: any) => {
			if(response.success)
				this.roster.push({name: firstName + " " + lastName, email: undefined, _id: response.result});
		}))
	}

	getRegistrationCode(_id: string) {
		if(this.roster===undefined)
			return of("");
		return this.apiService.getMemberCode(_id).pipe(map(res => {
			if(res.success)
				return res.result;
			else
				return "Could not load";
		}));
	}

	mapIdToClub(_id: string) {
		if(_id == "5e3a24a6dc788b2ee0c9b237") return "Glucose Guardians (Dummy)";
		if(_id == "5dc63afc357a5220c81d162f") return "Glucose Guardians (Dummy 2)";
		if(_id == "5e5326cf0ac7020928156359") return "Honey (Dummy)";
		return "Club not Found";
	}

	mapIdToDivision(_id: string) {
		if(_id == "5e3a212917f56d2ee0b4a1e5") return "Dummy";
		if(_id == "5d9076793e4b2e5f4c296dd9") return "Dummy 2";
		return "Division not Found";
	}

}
