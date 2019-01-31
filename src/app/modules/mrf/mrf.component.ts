import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cerf } from '@core/data/cerf';
import { Mrf } from '@core/data/mrf';
import { DataService } from '@core/data/data.service';
import { Location } from '@angular/common';

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

	meetingColumns = [{def: "date", title: "Date", footer: "Date", defaultFooter: ""},
						{def: "numMembers", title: "Home Club Members", footer: "#", defaultFooter: 0},
						{def: "numNonHomeMembers", title: "Outside CKI Members", footer: "#", defaultFooter: 0},
						{def: "numKiwanis", title: "Date", footer: "Kiwanis", defaultFooter: 0},
						{def: "numGuests", title: "Date", footer: "Other Guests", defaultFooter: 0},
						{def: "advisorAttended.faculty", title: "Faculty advisor", footer: "True/False", defaultFooter: ""},
						{def: "advisorAttended.kiwanis", title: "Kiwanis advisor", footer: "True/False", defaultFooter: ""}]
						// {def: "date", title: "Date", footer: "Date", defaultFooter: ""},];
	boardMeetingColumns = [{def: "date", title: "Date", footer: "Date", defaultFooter: ""},
						{def: "boardMembers", title: "Board Members", footer: "#", defaultFooter: 0},
						{def: "guests", title: "Guests", footer: "#", defaultFooter: 0}];
	fundraisingColumns = [{def: "source", title: "Source", footer: "+ Add Fundraiser", defaultFooter: ""},
						{def: "ptp", title: "PTP", footer: "#", defaultFooter: 0},
						{def: "kfh", title: "KFH", footer: "#", defaultFooter: 0},
						{def: "fa", title: "Feeding America", footer: "#", defaultFooter: 0},
						{def: "other", title: "Other charity", footer: "#", defaultFooter: 0},
						{def: "admin", title: "Administrative", footer: "#", defaultFooter: 0}]


	constructor(private route: ActivatedRoute, private dataService: DataService,
		private _location: Location, private builder: FormBuilder) {
		this.mrf = this.route.snapshot.data['mrf'];

		this.mrfForm = this.dataService.getMrfFormState;
		if(!this.mrfForm)
			this.mrfForm = this.createMrf(this.mrf);

		this.currentTab = this.dataService.getMrfTabState;
	}

	ngOnInit() {
		// if(this.mrf.data)
		// 	this.cerfs=this.mrf.data.events;
		// let id = this.route.snapshot.params.id;
		// this.dataService.getMrfById(id).subscribe(mrf => this.mrf = mrf);

		// console.log("init"); // Lifecycles not executed on route reuse
	}

	inputListReady(name, event) {
		this.mrfForm.setControl(name, event);
	}

	deleteMeeting(i: number) {
		const meetings = this.mrfForm.controls['meetings'] as FormArray;
		meetings.removeAt(i);
		this.mrfForm.get('meetings').markAsDirty();
	}

	addMeeting() {
		const meetings = this.mrfForm.controls['meetings'] as FormArray;
		meetings.controls.push(this.builder.group({
			advisorAttended: this.builder.group({faculty: [""], kiwanis: [""]}), date: [""], numGuests: [""],
			numKiwanis: [""], numMembers: [""], numNonHomeMembers: [""]}
		));
		console.log(meetings);
		this.mrfForm.get('meetings').markAsDirty();
	}

	saveMrf() {
		this.dataService.updateMrf(this.getMrfFromForm()).subscribe(res => {this.mrfForm.markAsPristine();});
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
	        events: this.builder.array(model.events),
	        // goals: [],
	        kfamReport: this.builder.control(model.kfamReport),
	        // meetings: [],
	        // boardMeetings: [],
	        // fundraising: [],
	        month: this.builder.control(model.month),
	        year: this.builder.control(model.year),
	        updates: this.builder.group(model.updates)
	    })

		return form;
	}

	private createMrf(model: Mrf): FormGroup {
		/* Fill in CERF with null values so we can at least create a form */
		/* We're assuming a Cerf IS passed in (i.e. has all the non-optional properties at least) */
		this.fillDefaults(model);
		let copyModel = JSON.parse(JSON.stringify(model));	// Cooking the data passes by reference, so nested arrays in objects are altered
		const form = this.cookData(copyModel);
		// this.setValidators(form, [
		// 	]);
		console.log(form);
		return form;
	}

	private fillDefaults(model: Mrf): void
	{
		// Set default values of a Partial<Cerf>
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
		console.log(rawMrf);
		// Object.assign(this.mrf, rawMrf);
		// console.log(this.mrf);
		return this.mrf;
	}

	goBack() {
		this._location.back();
	}
}