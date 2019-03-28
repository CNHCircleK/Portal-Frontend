import { Injectable } from '@angular/core';
import { Cerf } from '@core/models';
import { ApiService } from './api.service';
import { AuthService } from '@core/authentication/auth.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable()
export class CerfService {
	private cerf: Cerf;
	private cerfForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
	private user;

	constructor(private apiService: ApiService, private authService: AuthService, private builder: FormBuilder)
	{
		this.user = authService.getUser();
	}

	blankCerf() {
		return new Cerf("new","New Event",this.user.club_id,this.user.division_id,
			{start: new Date(), end: new Date() }, // time
			{ _id: this.user._id, name: { first: "", last: ""} }, // author
			{ _id: this.user._id, name: { first: "", last: ""} }, // chair
			"", // location
			"", // contact
			[],	// tags
			[],	// attendees
			{service: 0, leadership: 0, fellowship: 0 },
			[],	// override hours
			{ amountRaised: 0, amountSpent: 0, usedFor: "" },
			[],	// drivers
			{ summary: "", strengths: "", weaknesses: "", improvements: "" },
			[], // kfam attendance
			[], // categories
			(this.user.access.club > 1 ? 1 : 0) // status
			)
	}

	loadCerf(id: string) {
		// make api call and adapt it to local variable
		console.log(id);
		return this.apiService.getCerf(id).pipe(tap(response => {
			this.cerf = response.result;
			this.cerfForm.next(this.createReactiveForm(this.cerf));
		}));
		// this.cerfForm.next(this.createReactiveForm(this.blankCerf()));
	}

	dispatchCerf() {

	}

	getCerf() {
		return this.cerf;
	}

	getCerfForm() {
		console.log(this.cerfForm.value);
		return this.cerfForm.value;	// return asObservable instead pros/cons?
	}

	/*
	getters for identifiable subcomponents, e.g. attendees
	*/

	setCerf(cerf: Cerf) {
		// Initial thought would be to tie this local object to the DOM, but this object doesn't have to be binded to the DOM form
		this.cerf = cerf;
	}
	// setCerfFromForm(cerf: FormGroup) {}

	/*
	setters for identifiable subcomponents, e.g. attendees
	*/

	addAttendee(name: string, service: number, leadership: number, fellowship: number, paid: boolean)
	{
		// update form with new attendee
	}



	private createReactiveForm(model: Cerf): FormGroup {
		let form = this.builder.group({
			name: [model.name],
			chair_id: [model.chair._id],
			author: [model.author.name.first + " " + model.author.name.last],	// could create a name concatenator function...
			time: this.builder.group(model.time),
			location: model.location,
			contact: model.contact,
			tags: this.builder.array(model.tags),
			attendees: this.builder.array(model.attendees.map(eachAttendee => this.builder.group(eachAttendee))),
			hoursPerAttendee: this.builder.group(model.hoursPerAttendee),
			overrideHours: this.builder.array(model.overrideHours.map(eachOverride => this.builder.group(eachOverride))),
			fundraised: this.builder.group(model.fundraised),
			categories: this.builder.array(model.categories),
			comments: this.builder.group(model.comments),
			drivers: this.builder.array(model.drivers.map(eachDriver => this.builder.group(eachDriver))),
			kfamAttendance: this.builder.array(model.kfamAttendance.map(eachkfam => this.builder.group(eachkfam)))
		})
		return form;
	}

	logForm() {
		console.log(this.cerfForm.value);
	}
}