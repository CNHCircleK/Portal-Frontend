import { Component, Input, Directive, Renderer2, ElementRef, ViewChild } from '@angular/core';
// import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cerf } from '@core/data/cerf';
import { DataService } from '@core/data/data.service';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { MatSort, MatTableDataSource } from '@angular/material';

import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '@app/modules/confirm-dialog/confirm-dialog.component';

import { Member, AuthService } from '@core/authentication/auth.service';

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

	myForm: FormGroup;
	comment: string = "HEY";

	constructor(private route: ActivatedRoute, private dataService: DataService,
		private auth: AuthService, private _location: Location, public dialog: MatDialog,
		private builder: FormBuilder) {
		// this.route.data.subscribe(response => this.cerf = response.cerf);
		this.cerf = this.route.snapshot.data['cerf'];
		this.myForm = this.createForm(this.cerf);
		console.log(this.myForm);
	}

	//id: number;
	user: Member; read: boolean = true;
	cerf: Cerf;
	members: MatTableDataSource<string>;
	displayedColumns = ['members'];
	@ViewChild(MatSort) sort;

	ngOnInit() {
		this.auth.getUser().subscribe(user => {
			this.user = user;
			this.read = user.access.club < 2 && this.auth.navFromMrf;
		});

		this.members = new MatTableDataSource(this.cerf.data.attendees);
		
	}
	ngAfterViewInit() {
		this.members.sort = this.sort;
	}

	saveCerf() {
		this.cerf.data.attendees = this.members.data;
		this.dataService.updateCerf(this.cerf);
	}

	trackByIndex(index: number, obj: any): any {
		return index;
	}

	addMember() {
		this.cerf.data.attendees = this.members.data;
		this.cerf.data.attendees.push("Member " + this.cerf.data.attendees.length);
		this.members.data = this.cerf.data.attendees;
	}

	removeMember(i: number) {
		this.cerf.data.attendees.splice(i, 1);
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

	generateExcel() {
		// const items: any[] = [this.data];
		// const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
		// const header = Object.keys(items[0])
		// let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
		// csv.unshift(header.join(','))
		// let csvString = csv.join('\r\n')
		// let fields = ['_id', 'chair_id', 'time.start', 'time.end', 'location', 'attendees', 'hours_per_attendee.service',
		// 				'hours_per_attendee.leadership', 'hours_per_attendee.fellowship', 'override_hours', 'tags', 'fundraised', 'status'];
		// console.log(json2csv({ data: this.data, fields: fields }));
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

		return this.builder.group({
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

			 	location: [model.data.time.end],

			 		// cerf.data.hours_per_attendee
			 		service_hours: [model.data.hours_per_attendee.service],
			 		leadership_hours: [model.data.hours_per_attendee.leadership],
			 		fellowship_hours: [model.data.hours_per_attendee.fellowship],

			 	attendees: this.builder.array( [] ),
			 		/** push formgroup { name, service, fellowship, leadership, paid: bool } **/
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
	}

	goBack() {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {

		});
		dialogRef.componentInstance.confirmMessage = "You have not saved yet. Leave?";
		dialogRef.afterClosed().subscribe(result => {
			if(result) this._location.back();
			return result;
		})
	}
}