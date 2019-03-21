import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { DataService } from '@core/data/data.service';

@Injectable({ providedIn: 'root' })
export class MemberService {
	
	roster: {name: string, email: string, _id: string}[];

	constructor(private data: DataService) {
		this.getMembers().subscribe();
	}

	getMembers(): Observable<any> {  // stop caching in this service
		if(this.roster)
			return of(this.roster);
		else
			return this.data.fetchMembers().pipe(map(response => {
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
		return this.data.addMember(firstName, lastName).pipe(tap((response: any) => {
			if(response.success)
				this.roster.push({name: firstName + " " + lastName, email: undefined, _id: response.result});
		}))
	}

	getRegistrationCode(_id: string) {
		if(this.roster===undefined)
			return of("");
		return this.data.getMemberCode(_id).pipe(map(res => {
			if(res.success)
				return res.result;
			else
				return "Could not load";
		}));
	}

	mapIdToClub(_id: string) {
		if(_id == "5b6d2054f176363426fe5b93") return "Berkeley";
		return "Club not Found";
	}

	mapIdToDivision(_id: string) {
		if(_id == "5b6d1fbfdf9a7b34033f945c") return "Golden Gate";
		return "Division not Found";
	}

}
