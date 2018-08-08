import { Component, Input, Directive, Renderer2, ElementRef, ViewChild } from '@angular/core';
// import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
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

// @Directive({
// 	selector: 'input'
// })
// export class MemberInput {
// 	constructor(public renderer: Renderer2, public elementRef: ElementRef) {}

// 	ngOnInit() {
// 		this.renderer.selectRootElement('#');
// 	}
// }


@Component({
	selector: 'app-cerf',
	templateUrl: './cerf.component.html',
	styleUrls: ['./cerf.component.css'],
})

export class CerfComponent {
	@Input() mrfView: boolean = false;

	tabs: string[] = ["main", "attendance", "fundraising", "drivers", "commentary"];
	currentTab: string;
	members: MatTableDataSource<string>;
	attendanceColumns: string[] = ['members', 'service', 'leadership', 'fellowship', 'unpaid'];

	myForm: FormGroup;
	comment: string = "HEY";

	constructor(private route: ActivatedRoute, private dataService: DataService,
		private auth: AuthService, private _location: Location, public dialog: MatDialog,
		private builder: FormBuilder) {
		// this.route.data.subscribe(response => this.cerf = response.cerf);
		this.cerf = this.route.snapshot.data['cerf'];
		this.myForm = this.createForm(this.cerf);

		this.currentTab = "main";
	}

	//id: number;
	user: Member; read: boolean = true;
	cerf: Cerf;
	
	@ViewChild(MatSort) sort;

	ngOnInit() {
		this.auth.getUser().subscribe(user => {
			this.user = user;
			this.read = user.access.club < 2 && this.auth.navFromMrf;
		});

		// this.members = new MatTableDataSource(this.cerf.data.attendees);
		let membersControl = this.myForm.get('attendees') as FormArray;
		this.members = new MatTableDataSource(new Array(membersControl.length).map((v, index) => membersControl.at(index).value as string))
		
	}
	ngAfterViewInit() {
		this.members.sort = this.sort;
	}

	saveCerf() {
		// this.cerf.data.attendees = this.members.data;
		this.dataService.updateCerf(this.getCerfFromForm());
	}

	trackByIndex(index: number, obj: any): any {
		return index;
	}

	addMember() {
		// this.cerf.data.attendees = this.members.data;
		// this.cerf.data.attendees.push("Member " + this.cerf.data.attendees.length);
		// this.members.data = this.cerf.data.attendees;

		const attendees = this.myForm.controls['attendees'] as FormArray;
		attendees.controls.push(this.builder.group({name: [""], service: [""], leadership: [""], fellowship: [""], unpaid: [""]}));

		this.members.data = new Array(attendees.length).map((v, index) => attendees.at(index).value as string);
		this.myForm.markAsTouched();
	}

	removeMember(i: number) {
		const attendees = this.myForm.controls['attendees'] as FormArray;
		attendees.removeAt(i);

		this.members.data = new Array(attendees.length).map((v, index) => attendees.at(index).value as string);
		this.myForm.markAsTouched();
	}

	deleteCerf() {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {

		});
		dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				this._location.back();
				this.dataService.deleteCerf(this.cerf._id);
			}
		})
		
	}

	submitCerf() {
		this.dataService.submitCerf(this.cerf._id);

	}

	approveCerf() {
		this.cerf.data.status = 0;
	}


	private createForm(model: Cerf): FormGroup {
		/* Fill in CERF with null values so we can at least create a form */
		/* We're assuming a Cerf IS passed in (i.e. has all the non-optional properties at least */
		if(!model.data) {
			model.data = {
				cerf_author: "",
				chair_id: "",
				chair_name: "",
				event_contact: "",
				event_number: "",
				time: {
					start: new Date('2018-01-01T00:00:00'),
					end: new Date('2018-01-01T00:00:00')
				},
				location: "",
				hours_per_attendee: {
					service: 0,
					leadership: 0,
					fellowship: 0
				},
				attendees: [],
				total_attendees: 0,
				tags: {
					service: "",
					leadership: "",
					fellowship: "",
					miscellaneous: "",
				},
				
				drivers: [],
				total_drivers: 0,
				total_mileageTo: 0,
				total_mileageFrom: 0,
				total_mileage: 0,

				funds_raised: 0,
				funds_spent: 0,
				funds_profit: 0,
				funds_usage: "",

				commentary: {
					summary: "",
					strengths: "",
					weaknesses: "",
					advice: ""
				},

				comments: [],

				history: [],

				status: 1
			}
		} else {
			if(!model.data.hours_per_attendee) {
				model.data.hours_per_attendee = {
					service: 0,
					leadership: 0,
					fellowship: 0
				}
			}
			if(!model.data.attendees)
				model.data.attendees = [];
			if(!model.data.tags) {
				model.data.tags = {
					service: "",
					leadership: "",
					fellowship: "",
					miscellaneous: ""
				}
			}
			if(!model.data.drivers)
				model.data.drivers = []
			if(!model.data.commentary){
				model.data.commentary = {
					summary: "",
					strengths: "",
					weaknesses:  "",
					advice: ""
				}
				if(!model.data.comments)
					model.data.comments = [];
				if(!model.data.history)
					model.data.history = [];
			}

		}

		let form = this.builder.group({
				_id: [model._id],
			 	event_name: [model.event_name],
			 	date: [model.date],

			 	// cerf.data
			 	cerf_author: [model.data.cerf_author],
			 	chair_id: [model.data.chair_id],
			 	chair_name: [model.data.chair_name],
			 	event_contact: [model.data.event_contact],
			 	event_number: [model.data.event_number],

			 		// cerf.data.time
			 		time_start: [model.data.time.start],
			 		time_end: [model.data.time.end],

			 	location: [model.data.location],

			 		// cerf.data.hours_per_attendee
			 		service_hours: [model.data.hours_per_attendee.service],
			 		leadership_hours: [model.data.hours_per_attendee.leadership],
			 		fellowship_hours: [model.data.hours_per_attendee.fellowship],

			 	attendees: this.builder.array( [] ), //this.builder.group({name: [""], service: [""], leadership: [""], fellowship: [""], unpaid: [""]})
			 		/** push formgroup { name, service, fellowship, leadership, unpaid: bool } **/
			 	total_attendees: [model.data.attendees.length],	// READONLY

			 		// cerf.data.tags
			 		service_tags: [model.data.tags.service],
			 		leadership_tags: [model.data.tags.leadership],
			 		fellowship_tags: [model.data.tags.fellowship],
			 		miscellaneous_tags: [model.data.tags.miscellaneous],
			 	
			 	drivers: this.builder.array( [] ),
			 		/** push group { name, mileageTo, mileageFrom } **/
			 	total_drivers: [model.data.drivers.length],
				total_mileageTo: [model.data.total_mileageTo],
				total_mileageFrom: [model.data.total_mileageFrom],
				total_mileage: [model.data.total_mileage],

				funds_raised: [model.data.funds_raised],
				funds_spent: [model.data.funds_spent],
				funds_profit: [model.data.funds_profit],
				funds_usage: [model.data.funds_usage],

				commentary: this.builder.group({
					summary: [model.data.commentary.summary],
					strengths: [model.data.commentary.strengths],
					weaknesses: [model.data.commentary.weaknesses],
					advice: [model.data.commentary.advice]
				}),

				// comments: this.builder.array( [] ),
				// history: this.builder.group( [] ),

				status: [model.data.status] // READONLY
		});

		model.data.attendees.forEach( (v, index) => (form.controls['attendees'] as FormArray).push(this.builder.group({
			 										name: [v.name], service: [v.service], leadership: [v.leadership], fellowship: [v.fellowship], unpaid: [v.unpaid]})));
		return form;
	}

	public getCerfFromForm() {
		let rawCerf = this.myForm.getRawValue();

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


		let cookedCerf: Cerf = {
			_id: rawCerf._id,
			event_name: rawCerf.event_name,
			date: rawCerf.date,
			data: {
				cerf_author: rawCerf.cerf_author,	// not shown
				chair_id: rawCerf.chair_id,		// not shown
				chair_name: rawCerf.chair_name,
				event_contact: rawCerf.event_contact,
				event_number: rawCerf.event_number,
				time: {
					start: rawCerf.time_start,	// dupe cerf.date
					end: rawCerf.time_end
				},
				location: rawCerf.location,
				hours_per_attendee: {
					service: rawCerf.service,
					leadership: rawCerf.leadership,
					fellowship: rawCerf.fellowship
				},
				attendees: rawCerf.attendees,
				total_attendees: rawCerf.total_attendees,	// not editable
				tags: {
					service: rawCerf.service,
					leadership: rawCerf.leadership,
					fellowship: rawCerf.fellowship,
					miscellaneous: rawCerf.miscellaneous,
				},
				drivers: rawCerf.drivers,
				total_drivers: rawCerf.total_drivers,	// not editable
				total_mileageTo: rawCerf.total_mileageTo,	// not shown
				total_mileageFrom: rawCerf.total_mileageFrom,	// not shown
				total_mileage: rawCerf.total_mileage,	// not editable

				funds_raised: rawCerf.funds_raised,
				funds_spent: rawCerf.funds_spent,
				funds_profit: rawCerf.funds_profit,	// not editable
				funds_usage: rawCerf.funds_usage,

				commentary: {
					summary: rawCerf.summary,
					strengths: rawCerf.strengths,
					weaknesses: rawCerf.weaknesses,
					advice: rawCerf.advice
				},


				status: rawCerf.status	// Enums. not editable
			}
		}
		return cookedCerf;
		/*
		a
		*/
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