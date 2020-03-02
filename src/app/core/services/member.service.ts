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

	newMember(clubId: string, firstName: string, lastName: string) {
		return this.apiService.addMember(clubId, firstName, lastName).pipe(tap((response: any) => {
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
		if(_id == "5e5c711810044733ac495672") return "Sacramento State";
		return "Club";
	}

	mapIdToDivision(_id: string) {
		if(_id == "5e5c710f10044733ac495671") return "Capital";
		if(_id == "5e5c71a010044733ac49567a") return "Central Coast";
		if(_id == "5e5c719810044733ac495679") return "Citrus";
		if(_id == "5e5c718910044733ac495677") return "Desert Oasis";
		if(_id == "5e5c719310044733ac495678") return "Foothill";
		if(_id == "5e5c717e10044733ac495676") return "Golden Gate";
		if(_id == "5e5c716c10044733ac495673") return "Metro";
		if(_id == "5e5c717310044733ac495674") return "Paradise";
		if(_id == "5e5c717a10044733ac495675") return "Sunset";
		return "Division not Found";
	}

}
