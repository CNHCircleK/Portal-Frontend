import { Injectable } from '@angular/core';
import { Cerf } from '@core/models';
import { ApiService } from './api.service';
import { AuthService } from '@core/authentication/auth.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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


	/**
	 * @param {string} id The id of the CERF to fetch from the back-end
	 * @returns The API call observable and loading side-effect
	 * Fetches the CERF from the back-end and loads it into the service
	 */
	 loadCerf(id: string): Observable<Cerf> {
	 	// make api call and adapt it to local variable
	 	if (id == "new")
	 	{
	 		this.cerf = this.blankCerf();	// new Cerf(response.result)?
	 		this.cerfForm.next(this.createReactiveForm(this.cerf));
	 		return of(this.cerf);
	 	} else {
		 	return this.apiService.getCerf(id).pipe(tap(response => {
		 		this.cerf = response.result;	// new Cerf(response.result)?
		 		this.cerfForm.next(this.createReactiveForm(this.cerf));
		 		if((this.cerf.status == 1 && this.user.access.club <= 1)
		 			|| (this.cerf.status == 2)) {
		 			this.cerfForm.value.disable();
		 		}
		 	}), map(res => (res.result)));
		 }
	 	// this.cerfForm.next(this.createReactiveForm(this.blankCerf()));
	 }

	 dispatchNewCerf() {
	 	return this.apiService.createNewCerf(this.getCerfFromForm(this.cerfForm.value));
	 }

	 dispatchUpdate() {
	 	return this.apiService.updateCerf(this.getCerfFromForm(this.cerfForm.value));
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

	/*
	setters for identifiable subcomponents, e.g. attendees
	*/

	deleteCerf() {
		// Can we ensure cerf and cerfForm are in sync
		return this.apiService.deleteCerf(this.cerf._id);
	}

	submitCerf() {
		return this.apiService.changeCerfStatus(this.cerf._id, "SUBMIT");
	}

	unsubmitCerf() {
		return this.apiService.changeCerfStatus(this.cerf._id, "UNSUBMIT");
	}

	getTags() {
		return this.apiService.getTags().pipe(map( res => {
			if(res && res.success) {
				return res.result;
			} else {
				return [];
			}
		}))
	}

	addToMRF() {
		return this.apiService.changeCerfStatus(this.cerf._id, "CONFIRM");
	}

	removeFromMRF() {
		return this.apiService.changeCerfStatus(this.cerf._id, "UNCONFIRM");
	}

	addAttendee(name: string, service: number, leadership: number, fellowship: number, paid: boolean)
	{
		// update form with new attendee
	}



	private createReactiveForm(model: Cerf): FormGroup {
		let form = this.builder.group({
			name: [model.name],
			chair_id: [model.chair._id],
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

	public getCerfFromForm(form: FormGroup) {
		let rawCerf = form.getRawValue();

		/* Split up attendees and overrideHours */
		const defaultHours = form.get('hoursPerAttendee').value;
		const attendees = rawCerf.attendees.filter(a => (a.service == defaultHours.service && a.leadership == defaultHours.leadership
			&& a.fellowship == defaultHours.fellowship)).map(attendee => attendee.member);
		const overrideHours = rawCerf.attendees.filter(a => (a.service != defaultHours.service || a.leadership != defaultHours.leadership
			|| a.fellowship != defaultHours.fellowship));
		console.log(overrideHours);
		overrideHours.forEach((attendee, index, arr) => arr[index]['attendee_id'] = arr[index].member);
		rawCerf.attendees = attendees;
		rawCerf.overrideHours = overrideHours;

		Object.assign(this.cerf, rawCerf);
		console.log(this.cerf);
		return this.cerf;
	}
}
