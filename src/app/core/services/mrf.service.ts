import { Injectable } from '@angular/core';
import { Mrf, Cerf } from '@core/models';
import { ApiService } from './api.service';
import { AuthService } from '@core/authentication/auth.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import * as moment from 'moment';

@Injectable()
export class MrfService {
	private mrf: Mrf;
	private mrfForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(undefined);
	private user;

	constructor(private apiService: ApiService, private authService: AuthService, private builder: FormBuilder)
	{
		this.user = this.authService.getUser();
	}

	loadMrf(year: string, month: string) {
		return this.apiService.getMrfByDate(year, month).pipe(tap(response => {
			this.mrf = response.result;
			this.mrfForm.next(this.createReactiveForm(this.mrf));
		}));
	}

	dispatchUpdate() {
		return this.apiService.updateMrf(this.getMrfFromForm(this.mrfForm.value)).pipe(tap(response => console.log(response)));
	}

	getMrf() {
		return this.mrf;
	}

	getMrfForm() {
		return this.mrfForm.value;
	}

	/*
	getters for identifiable subcomponents, e.g. meetings
	*/

	setMrf(mrf: Mrf) {
		// Initial thought would be to tie this local object to the DOM, but this object doesn't have to be binded to the DOM form
		this.mrf = mrf;
	}
	/*
	setters for identifiable subcomponents, e.g. meetings
	*/

	private createReactiveForm(model: Mrf): FormGroup {
		// this.fillDefaults(model);

		let form = this.builder.group({
			communications: this.builder.group(model.communications),
	        dcm: this.builder.group(model.dcm),
	        events: this.builder.array(model.events.map(eachEvent => this.builder.group(eachEvent))),
	        goals: this.builder.array(model.goals),
	        kfamReport: this.builder.control(model.kfamReport),
	        meetings: this.builder.array(model.meetings.map(eachMeeting => this.builder.group({date: this.builder.control(moment(eachMeeting.date).format("MM-DD-YYYY")), attendance: this.builder.group(eachMeeting.attendance), advisorAttended: this.builder.group(eachMeeting.advisorAttended)}))),
	        boardMeetings: this.builder.array(model.boardMeetings.map(eachBoardMeeting => this.builder.group({date: this.builder.control(moment(eachBoardMeeting.date).format("MM-DD-YYYY")), attendance: this.builder.group(eachBoardMeeting.attendance)}))),
	        fundraising: this.builder.array(model.fundraising.map(eachFundraising => this.builder.group(eachFundraising))),
	        month: this.builder.control(model.month),
	        year: this.builder.control(model.year),
	        club_id: this.builder.control(model.club_id),
	        numDuesPaid: this.builder.control(model.numDuesPaid),
	        status: this.builder.control(model.status),
	        submissionTime: this.builder.control(model.submissionTime)
	    })

		return form;
	}

	private getMrfFromForm(form: FormGroup) {
		let rawMrf = form.getRawValue();
		rawMrf.meetings.forEach(meeting => meeting.date = new Date(meeting.date).toISOString());
		rawMrf.boardMeetings.forEach(meeting => meeting.date = new Date(meeting.date).toISOString());
		Object.assign(this.mrf, rawMrf);
		// console.log(this.mrf);
		return this.mrf;
	}
}