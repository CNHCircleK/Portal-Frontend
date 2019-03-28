import { Component, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Mrf, Cerf } from '@core/models';
import { DataService } from '@core/data/data.service';
import { Location } from '@angular/common';
import { MatTable } from '@angular/material';
import * as moment from 'moment';

@Component({
	selector: 'app-mrf',
	templateUrl: './mrf.component.html',
	styleUrls: ['./mrf.component.css', './_mrf.component.scss']
})

export class MrfComponent {

	//id: number;
	mrf: Mrf;
	mrfForm: FormGroup;
	currentTab: string;
	openedPanels: number[] = [0, 0, 0, 0];

	editingMeetings: boolean = false;
	editingBoardMeetings: boolean = false;
	editingFundraising: boolean = false;

	meetingColumns = ["date", "numMembers", "numNonHomeMembers", "numKiwanis", "numGuests", "facultyAttended", "kiwanisAttended", "actions"];
	boardMeetingColumns = ["date", "boardMembers", "guests", "actions"];
	fundraisingColumns = ["source", "ptp", "kfh", "fa", "other", "admin", "actions"];
	eventsColumns = ["name", "date", "numAttendees", "totalService", "totalLeadership", "totalFellowship", "tags", "actions"];

	defaultMeeting = { date: "", attendance: { numMembers: 0, numNonHomeMembers: 0, numKiwanis: 0, numGuests: 0}, advisorAttended: {faculty: false, kiwanis: false }};
	defaultBoardMeeting = { date: "", attendance: { numBoard: 0, numGuests: 0 } };
	defaultFundraising = { source: "", ptp: 0, kfh: 0, fa: 0, other: 0, admin: 0 };

	newMeeting = { date: "", attendance: { numMembers: 0, numNonHomeMembers: 0, numKiwanis: 0, numGuests: 0}, advisorAttended: {faculty: false, kiwanis: false }};
	newBoardMeeting = { date: "", attendance: { numBoard: 0, numGuests: 0 } };
	newFundraising = { source: "", ptp: 0, kfh: 0, fa: 0, other: 0, admin: 0 };
	// meetingColumns = [{def: "date", title: "Date", footer: "Date", defaultFooter: ""},
	// 					{def: "numMembers", title: "Home Club Members", footer: "#", defaultFooter: 0},
	// 					{def: "numNonHomeMembers", title: "Outside CKI Members", footer: "#", defaultFooter: 0},
	// 					{def: "numKiwanis", title: "Date", footer: "Kiwanis", defaultFooter: 0},
	// 					{def: "numGuests", title: "Date", footer: "Other Guests", defaultFooter: 0},
	// 					{def: "advisorAttended.faculty", title: "Faculty advisor", footer: "True/False", defaultFooter: ""},
	// 					{def: "advisorAttended.kiwanis", title: "Kiwanis advisor", footer: "True/False", defaultFooter: ""}]
	// boardMeetingColumns = [{def: "date", title: "Date", footer: "Date", defaultFooter: ""},
	// 					{def: "boardMembers", title: "Board Members", footer: "#", defaultFooter: 0},
	// 					{def: "guests", title: "Guests", footer: "#", defaultFooter: 0}];
	// fundraisingColumns = [{def: "source", title: "Source", footer: "+ Add Fundraiser", defaultFooter: ""},
	// 					{def: "ptp", title: "PTP", footer: "#", defaultFooter: 0},
	// 					{def: "kfh", title: "KFH", footer: "#", defaultFooter: 0},
	// 					{def: "fa", title: "Feeding America", footer: "#", defaultFooter: 0},
	// 					{def: "other", title: "Other charity", footer: "#", defaultFooter: 0},
	// 					{def: "admin", title: "Administrative", footer: "#", defaultFooter: 0}]

	@ViewChildren(MatTable) tables: QueryList<MatTable<any>>;

	constructor(private route: ActivatedRoute, private dataService: DataService,
		private _location: Location, private builder: FormBuilder, private renderer: Renderer2) {
		this.mrf = this.route.snapshot.data['mrf'];

		this.mrfForm = this.dataService.getMrfFormState;
		if(!this.mrfForm)
			this.mrfForm = this.createMrf(this.mrf);

		this.currentTab = this.dataService.getMrfTabState;

		console.log(this.meetingArray.getRawValue()[0]);
	}

	ngOnInit() {
		// if(this.mrf.data)
		// 	this.cerfs=this.mrf.data.events;
		// let id = this.route.snapshot.params.id;
		// this.dataService.getMrfById(id).subscribe(mrf => this.mrf = mrf);

		// console.log("init"); // Lifecycles not executed on route reuse
	}

	toggleEdit(num) {
		if(num==1)
			this.editingMeetings = !this.editingMeetings;
		else if(num==2)
			this.editingBoardMeetings = !this.editingBoardMeetings;
		else if(num==3)
			this.editingFundraising = !this.editingFundraising;
	}

	deleteMeeting(index) {
		this.meetingArray.removeAt(index);
		this.tables.toArray()[0].renderRows();
		this.mrfForm.markAsDirty();
	}
	deleteBoardMeeting(index) {
		this.boardMeetingArray.removeAt(index);
		this.tables.toArray()[1].renderRows();
		this.mrfForm.markAsDirty();
	}
	deleteFundraising(index) {
		this.fundraisingArray.removeAt(index);
		this.tables.toArray()[2].renderRows();
		this.mrfForm.markAsDirty();
	}

	addMeetingRow() {
		// Validate inputs
		if(!this.newMeeting.date || isNaN(this.newMeeting.attendance.numMembers) || isNaN(this.newMeeting.attendance.numNonHomeMembers) || 
			isNaN(this.newMeeting.attendance.numKiwanis) || isNaN(this.newMeeting.attendance.numGuests))
			return;
		// this.meetingArray.push(this.builder.group({date: this.newMeeting.date, attendance: { numMembers: this.newMeeting.numMembers,
			// numNonHomeMembers: this.newMeeting.numNonHomeMembers, numKiwanis: this.newMeeting.numKiwanis, numGuests: this.newMeeting.numGuests } advisorAttended: this.builder.group(this.newMeeting.advisorAttended)}));
		this.meetingArray.push(this.builder.group({...this.newMeeting, attendance: this.builder.group(this.newMeeting.attendance), advisorAttended: this.builder.group(this.newMeeting.advisorAttended)}));
		console.log(this.meetingArray);
		Object.assign(this.newMeeting, this.defaultMeeting);
		this.tables.toArray()[0].renderRows();

		const element = this.renderer.selectRootElement('#meetingFocus');
		setTimeout(() => element.focus(), 0);

		this.mrfForm.markAsDirty();
	}
	addBoardMeetingRow() {
		// Validate inputs
		if(!this.newBoardMeeting.date || isNaN(this.newBoardMeeting.attendance.numBoard) || isNaN(this.newBoardMeeting.attendance.numGuests))
			return;
		this.boardMeetingArray.push(this.builder.group({...this.newBoardMeeting, attendance: this.builder.group(this.newBoardMeeting.attendance)}));
		Object.assign(this.newBoardMeeting, this.defaultBoardMeeting);
		this.tables.toArray()[1].renderRows();

		const element = this.renderer.selectRootElement('#boardMeetingFocus');
		setTimeout(() => element.focus(), 0);

		this.mrfForm.markAsDirty();
	}
	addFundraisingRow() {
		// Validate inputs
		if(!this.newFundraising.source || isNaN(this.newFundraising.ptp) || isNaN(this.newFundraising.kfh) || isNaN(this.newFundraising.fa) ||
			isNaN(this.newFundraising.other) || isNaN(this.newFundraising.admin))
			return;
		this.fundraisingArray.push(this.builder.group(this.newFundraising));
		Object.assign(this.newFundraising, this.defaultFundraising);
		this.tables.toArray()[2].renderRows();

		const element = this.renderer.selectRootElement('#fundraisingFocus');
		setTimeout(() => element.focus(), 0);

		this.mrfForm.markAsDirty();
	}

	get meetingArray() {
		return this.mrfForm.get('meetings') as FormArray;
	}
	get boardMeetingArray() {
		return this.mrfForm.get('boardMeetings') as FormArray;
	}
	get fundraisingArray() {
		return this.mrfForm.get('fundraising') as FormArray;
	}
	get eventsArray() {
		return this.mrfForm.get('events') as FormArray;
	}

	saveMrf() {
		// this.getMrfFromForm();
		this.dataService.updateMrf(this.getMrfFromForm()).subscribe(res => {console.log(res); this.mrfForm.markAsPristine();});
	}

	private createReactiveForm(model: Mrf): FormGroup {
		// Make initial FormGroup (this does a shallow construction)
		// let form = this.builder.group(model);

		/* List of nested arrays/objects we need to define:
			time: { start, end }
			tags: []
			attendees: []
			hoursPerAttendee: { service, leadership, fellowship }
			overrideHours: { attendee_id, service, leadership, fellowship }[]
			fundraised: { amountRaised, amountSpent, usedFor }
			comments: { summary, strengths, weaknesses, improvements }
			categories: []
			drivers: { driver, milesTo, milesFrom }[]
			kfamAttendance: { org, numAttendees }[]
		*/

		this.fillDefaults(model);


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

	private createMrf(model: Mrf): FormGroup {
		/* Fill in CERF with null values so we can at least create a form */
		/* We're assuming a Cerf IS passed in (i.e. has all the non-optional properties at least) */
		this.fillDefaults(model);
		let copyModel = JSON.parse(JSON.stringify(model));	// Cooking the data passes by reference, so nested arrays in objects are altered
		// const form = this.cookData(copyModel);
		const form = this.createReactiveForm(copyModel);
		// this.setValidators(form, [
		// 	]);
		console.log(form);
		return form;
	}

	private fillDefaults(model: Mrf): void
	{
		// Set default values of a Partial<Cerf>
		if(!model.events)
		{
			model.events = [];
		}
	}

	private cookData(model: Object): FormGroup
	{
		if(model instanceof FormGroup)
			return model;
		let formGroup: { [id: string]: AbstractControl; } = {};
		Object.keys(model).forEach(key => {
			formGroup[key] = model[key] instanceof Date ? this.builder.control(model[key]) : // making formgroups out of single Dates doesn't make sense
			model[key] instanceof Array ? this.builder.array(this.helperCookArray(model[key])) :
			(model[key] instanceof Object ? this.cookData(model[key]) : this.builder.control(model[key]));
			// Note, Arrays are objects but objects are not arrays
		});
		return this.builder.group(formGroup);
	}

	private helperCookArray(arr: any[]): any[] {
		arr.forEach((element, index, array) => { 
			if(element instanceof Object)
				array[index] = this.cookData(element);
			else
				array[index] = this.builder.control(element);
		});	// Dangerously infinite loop
		return arr;
	}

	private setValidators(form: FormGroup, validators: {control: string, validator: ValidatorFn | ValidatorFn[]}[]) {
		validators.forEach((element, index, array) => {
			form.get(element.control).setValidators(element.validator);
			/* Check that this method will add new validators to exist validators in case when passed validators will be in array.
			In other case it will override previous validators. Here is the source:
				function coerceToValidator(validator: ValidatorFn | ValidatorFn[]): ValidatorFn {
					return Array.isArray(validator) ? composeValidators(validator) : validator;
				}
				*/
			})
	}

	public getMrfFromForm() {
		let rawMrf = this.mrfForm.getRawValue();
		rawMrf.meetings.forEach(meeting => meeting.date = new Date(meeting.date).toISOString());
		rawMrf.boardMeetings.forEach(meeting => meeting.date = new Date(meeting.date).toISOString());
		console.log(rawMrf);
		Object.assign(this.mrf, rawMrf);
		// console.log(this.mrf);
		return this.mrf;
	}

	goBack() {
		this._location.back();
	}
}