import { Component, Input, Directive, Renderer2, ElementRef, ViewChild } from '@angular/core';
// import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cerf } from '@core/data/cerf';
import { DataService } from '@core/data/data.service';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { MatSort, MatTableDataSource } from '@angular/material';

import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '@app/modules/confirm-dialog/confirm-dialog.component';

import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';

import { Observable, zip } from 'rxjs';

@Component({
	selector: 'app-cerf',
	templateUrl: './cerf.component.html',
	styleUrls: ['./cerf.component.css', './_cerf.component.scss'],
})

export class CerfComponent {
	
	editable: boolean = true;
	pendingAction: boolean = false;
	fromMrf: boolean = false;

	tabs: string[] = ["main", "attendance", "fundraising", "drivers", "commentary"];
	currentTab: string;

	members: MatTableDataSource<string>;
	attendanceColumns: string[] = ['members'];//, 'service', 'leadership', 'fellowship', 'unpaid'];

	myForm: FormGroup;
	// comment: string = "HEY";

	constructor(private route: ActivatedRoute, private dataService: DataService,
		private auth: AuthService, private _location: Location, public dialog: MatDialog,
		private builder: FormBuilder) {
		// this.route.data.subscribe(response => this.cerf = response.cerf);
		this.cerf = this.route.snapshot.data['cerf'];
		this.fromMrf = this.route.snapshot.data['mrfNav'];
		this.myForm = this.createCerf(this.cerf);

		this.currentTab = "main";
	}

	//id: number;
	user: Member;
	cerf: Cerf;
	
	@ViewChild(MatSort) sort;

	ngOnInit() {
		this.auth.getUser().subscribe(user => {
			this.user = user;
		});

		// this.members = new MatTableDataSource(this.cerf.data.attendees);

		let membersControl = this.attendees;	// invoke getter
		this.members = new MatTableDataSource(new Array(membersControl.length).map((v, index) => membersControl.at(index).value as string));
		
		/*
			Readonly criteria
				Submitted and not secretary
				Approved (no one can edit)
				Not submitted and not the user's event (only the user should be able to access it anyways)
				*/
		if((this.cerf.status >= 1 && this.user.access.club <= 1) || (this.cerf.status == 2) ||
			(this.user._id != this.cerf.author_id && this.user.access.club != 2))
				this.myForm.disable();
		}
		ngAfterViewInit() {
			// if(!this.editable) {
			// 	this.myForm.disable();
			// }
			this.members.sort = this.sort;
		}

		trackByIndex(index: number, obj: any): any {
			return index;
		}

		addMember() {
		// this.cerf.data.attendees = this.members.data;
		// this.cerf.data.attendees.push("Member " + this.cerf.data.attendees.length);
		// this.members.data = this.cerf.data.attendees;

		const attendees = this.attendees;
		attendees.controls.push(this.builder.control(""));

		this.members.data = new Array(attendees.length).map((v, index) => attendees.at(index).value as string);
		this.myForm.markAsTouched();
	}

	removeMember(i: number) {
		const attendees = this.attendees;	// invoke the getter
		attendees.removeAt(i);

		this.members.data = new Array(attendees.length).map((v, index) => attendees.at(index).value as string);
		this.myForm.markAsTouched();
	}

	saveCerf() {
		// this.cerf.data.attendees = this.members.data;
		this.dataService.updateCerf(this.getCerfFromForm()).subscribe(res => {this.myForm.markAsPristine();});
	}

	deleteCerf() {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {

		});
		dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				this.dataService.deleteCerf(this.cerf._id).subscribe(res => {
					if(res)
						this._location.back();
					else
						window.alert("Could not delete.");
				},
				error => console.log(error));
			}
		})
		
	}

	submitCerf() {
		this.pendingAction = true;
		this.myForm.disable();
		this.dataService.updateCerfToPending(this.cerf._id, true).subscribe(res => {
			if(res)
				this.cerf.status = 1;
			this.pendingAction = false;
		},
		error => {
			console.log(error);
			window.alert("Failed Submitting!");
			this.pendingAction = false;
			this.myForm.enable();
		},
		() => {});
	}

	unsubmitCerf() {
		this.pendingAction = true;
		this.myForm.disable();
		this.dataService.updateCerfToPending(this.cerf._id, false).subscribe(res => {
			if(res)
				this.cerf.status = 0;
			this.myForm.enable();
			this.pendingAction = false;
		},
		error => {
			console.log(error);
			window.alert("Failed Unsubmitting!");
			this.pendingAction = false;
		},
		() => {});
	}

	approveCerf() {
		this.pendingAction = true;
		this.myForm.disable();
		this.dataService.updateCerfToConfirm(this.cerf._id, true).subscribe(res => {
			if(res)
				this.cerf.status = 2;
			this.pendingAction = false;
		},
		error => {
			console.log(error);
			window.alert("Failed Approving!");
			this.pendingAction = false;
			this.myForm.enable();
		},
		() => {});
	}

	unapproveCerf() {
		this.pendingAction = true;
		this.myForm.disable();
		this.dataService.updateCerfToConfirm(this.cerf._id, false).subscribe(res => {
			if(res)
				this.cerf.status = 1;
			this.myForm.enable();
			this.pendingAction = false;
		},
		error => {
			console.log(error);
			window.alert("Failed Unapproving!");
			this.pendingAction = false;
		},
		() => {});
	}

	get attendees() {
		return (this.myForm.controls['attendees'] as FormArray);
	}

	private createCerf(model: Cerf): FormGroup {
		/* Fill in CERF with null values so we can at least create a form */
		/* We're assuming a Cerf IS passed in (i.e. has all the non-optional properties at least */
		this.fillDefaults(model);
		const form = this.cookData(model);
		this.setValidators(form, [
			{ control: 'name', validator: Validators.required },
			{ control: 'hoursPerAttendee.service', validator: Validators.pattern('^[0-9]*$')}
			]);
		return form;
	}

	private fillDefaults(model: Cerf): void
	{
		// Set default values of a Partial<Cerf>
		// if(!model.data) {
		// 	model.data = {
		// 		cerf_author: "",
		// 		chair_id: "",
		// 		chair_name: "",
		// 		event_contact: "",
		// 		event_number: "",
		// 		time: {
		// 			start: new Date('2018-01-01T00:00:00'),
		// 			end: new Date('2018-01-01T00:00:00')
		// 		},
		// 		location: "",
		// 		hours_per_attendee: {
		// 			service: 0,
		// 			leadership: 0,
		// 			fellowship: 0
		// 		},
		// 		attendees: [],
		// 		total_attendees: 0,
		// 		tags: {
		// 			service: "",
		// 			leadership: "",
		// 			fellowship: "",
		// 			miscellaneous: "",
		// 		},

		// 		drivers: [],
		// 		total_drivers: 0,
		// 		total_mileageTo: 0,
		// 		total_mileageFrom: 0,
		// 		total_mileage: 0,

		// 		funds_raised: 0,
		// 		funds_spent: 0,
		// 		funds_profit: 0,
		// 		funds_usage: "",

		// 		commentary: {
		// 			summary: "",
		// 			strengths: "",
		// 			weaknesses: "",
		// 			advice: ""
		// 		},

		// 		comments: [],

		// 		history: [],

		// 		status: 1
		// 	}
		// } else {
		// 	if(!model.data.cerf_author)
		// 		model.data.cerf_author = "";
		// 	if(!model.data.hours_per_attendee) {
		// 		model.data.hours_per_attendee = {
		// 			service: 0,
		// 			leadership: 0,
		// 			fellowship: 0
		// 		}
		// 	}
		// 	if(!model.data.attendees)
		// 		model.data.attendees = [];
		// 	if(!model.data.tags) {
		// 		model.data.tags = {
		// 			service: "",
		// 			leadership: "",
		// 			fellowship: "",
		// 			miscellaneous: ""
		// 		}
		// 	}
		// 	if(!model.data.drivers)
		// 		model.data.drivers = []
		// 	if(!model.data.commentary){
		// 		model.data.commentary = {
		// 			summary: "",
		// 			strengths: "",
		// 			weaknesses:  "",
		// 			advice: ""
		// 		}
		// 		if(!model.data.comments)
		// 			model.data.comments = [];
		// 		if(!model.data.history)
		// 			model.data.history = [];
		// 	}

		// }
	}

	private cookData(model: Object): FormGroup
	{
		if(model instanceof FormGroup)	// Some protection against infinite loops
			return model;
		let formGroup: { [id: string]: AbstractControl; } = {};
		Object.keys(model).forEach(key => {
			formGroup[key] = 	model[key] instanceof Date ? this.builder.control(model[key]) : // making formgroups out of single Dates doesn't make sense
			model[key] instanceof Array ? this.builder.array(this.helperCookArray(model[key])) :
			(model[key] instanceof Object ? this.cookData(model[key]) : this.builder.control(model[key]));
			// Note, Arrays are objects but objects are not arrays
		});
		return this.builder.group(formGroup);
	}

	private  helperCookArray(arr: any[]): any[] {
		arr.forEach((element, index, array) => array[index] = this.cookData(element));	// Dangerously infinite loop
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

	public getCerfFromForm() {
		let rawCerf = this.myForm.getRawValue();
		// Destructure the form in case 
		// Object.keys(rawCerf).forEach(key => {
		// 	if(rawCerf instanceof AbstractControl)
		// 		rawCerf[key] = rawCerf[key].getRawValue();
		// });
		console.log(rawCerf);
		Object.assign(this.cerf, rawCerf);
		console.log(this.cerf);
		return this.cerf;

		// Object Destructuring https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
		/*let rawData = ( ({cerf_author, chair_id, chair_name, event_contact, event_number,location, total_attendees, total_drivers,
							total_mileageTo,total_mileageFrom, totale_mileage, funds_raised, funds_spent,
							funds_profit, funds_usage, status}) =>
							({cerf_author, chair_id, chair_name, event_contact, event_number,
							location, total_attendees, total_drivers, total_mileageTo,
							total_mileageFrom, totale_mileage, funds_raised, funds_spent,
							funds_profit, funds_usage, status}) ) (rawCerf);
							console.log(rawData);*/	
		// manually attach time, hours_per_attendee, attendance, tags, drivers, commentary
		// rawData['time'] = ( ({time_start: start, time_end: end}) => ( {time_start: start, time_end: end}) ) (rawCerf);
		// rawData['hour_per_attendee'] = ( ({service_hours, leadership_hours, fellowship_hours}) => ( {service_hours, leadership_hours, fellowship_hours}) ) (rawCerf);
		// rawData['attendees'] = rawCerf['attendees'];
		// rawData['tags'] = ( ({service_tags, leadership_tags, fellowship_tags, miscellaneous_tags}) => ( {service_tags, leadership_tags, fellowship_tags, miscellaneous_tags}) ) (rawCerf);
		// rawData['drivers'] = rawCerf['drivers'];
		// rawData['commentary'] = rawCerf['commentary'];
	}

	goBack() {
		if(!this.myForm.dirty) {	// No changes made. May have to add another condition to check for newly generated (unsaved)
			this._location.back();
		} // else
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {

		});
		dialogRef.componentInstance.confirmMessage = "You have not saved yet. Leave?";
		dialogRef.afterClosed().subscribe(result => {
			if(result) this._location.back();
			return result;
		})
	}

	/*
	@HostListener('window:beforeunload')
	canDeactivate(): Observable<boolean> | boolean {
	
	}
	*/
}