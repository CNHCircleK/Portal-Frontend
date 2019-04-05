import { Component, Input, Directive, Renderer2, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
// import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { MatTable, MatSort, MatTableDataSource } from '@angular/material';

import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogComponent } from '@app/modules/confirm-dialog/confirm-dialog.component';
import { InfoDialog } from '@app/modules/info-dialog/info-dialog';
import { TagsDialog } from './tags-dialog.component';

import { Cerf, Member, User } from '@core/models';
import { AuthService } from '@core/authentication/auth.service';
import { CerfService, MemberService } from '@core/services';

import { Observable, BehaviorSubject, zip } from 'rxjs';

type Attendee = {name: string, service: number, leadership: number, fellowship: number};
// type Member = {name: string, email: string, _id: string};	// Put into Member interface to be used by MemberService too

@Component({
	selector: 'app-cerf',
	templateUrl: './cerf.component.html',
	styleUrls: ['./cerf.component.css', './_cerf.component.scss'],
	providers: [ CerfService ]
})
export class CerfComponent {

	cerfId: string;

	pendingAction: boolean = false;

	openedPanels: number[] = [0, 0, 0, 0, 0, 0];

	attendees;
	attendanceColumns = ['members', 'service', 'leadership', 'fellowship'];
	kfamColumns = ['org', 'numAttendees'];
	driverColumns = ['driver', 'milesTo', 'milesFrom'];

	// For adding new rows
	defaultAttendance = {name: "", service: 0, leadership: 0, fellowship: 0};	// default should update to current "Default Hours" input
	defaultKfam = {org: "", numAttendees: 0};
	defaultDriver = {driver: "", milesTo: 0, milesFrom: 0};

	newAttendance = {name: "", service: 0, leadership: 0, fellowship: 0};
	newKfam = {org: "", numAttendees: 0};
	newDriver = {driver: "", milesTo: 0, milesFrom: 0};

	filteredRoster;

	cerfForm: FormGroup;

	categoryButtons: string[] = ["service", "leadership", "fellowship", "dogs"];
	categoriesActive: string[] = [];
	addingCategory: boolean = false;

	tagOptions: string[] = ['CO', 'CA', 'CS', 'DSI', 'ISI', 'AD', 'SD', 'MD', 'FR', /* ? */ 'CK', 'KF', 'IN', 'WB', 'DV', 'DE', 'INT', 'HE'];
	tagNames: string[] = ['Community Service', 'Campus Service', 'Continuing Service', 'District Service Initiative',
							'International Service Initiative', 'Administrative', 'Social Event', 'Membership Development', 'Fundraiser',
							'Circle K', 'Kiwanis Family', 'Interclub', 'Webinar', 'Divisional', 'District', 'International', 'Club Hosted'];
	tagIds: string[] = ["5c7e30c5d6f264025fe03332", "5c87f48fd434f107fa8c3f64", "5c87f4a0d434f107fa8c3f65", "5c87f4acd434f107fa8c3f66", "5c87f4d8d434f107fa8c3f67", "5c87f4e2d434f107fa8c3f68", "5c87f4e9d434f107fa8c3f69", "5c87f4f1d434f107fa8c3f6a", "5c87f4f7d434f107fa8c3f6b", "5c87f4fdd434f107fa8c3f6c", "5c87f506d434f107fa8c3f6d", "5c87f50ed434f107fa8c3f6e", "5c87f52dd434f107fa8c3f6f", "5c87f538d434f107fa8c3f70", "5c87f53fd434f107fa8c3f71", "5c87f543d434f107fa8c3f72", "5c87f549d434f107fa8c3f73"];
	tagDescriptions: string[] = [
	"An event where your club members are serving for the community without pay",
	"Any event where your club is doing community service on your school's campus",
	"An event that has been completed with the same organization repeatedly at least once a month for a two-month duration",
	"Any event that contributes to the current District Service Initiative",
	"Any event that contributes to the current International Service Initiative",
	"Any event related to the operation of the club should be tagged as AD. Examples of administrative events include but are not limited to\
		 attending meetings (e.g. general meetings, board meetings, committee meetings, Kiwanis meetings), and workshops",
	"Any event in which club members are socially interacting with one another should be tagged as SE. A social event promotes the moral of\
		members so it is usually tagged as MD; however, remember that although all SE events are MD-tagged, not all MD events are SE-tagged (e.g. workshops)",
	"An event that promotes membership recruitment and development",
	"A home club-hosted event that raises money for a charity or for administrative funds",
	"An event in which at least two members from your Circle K club and at least two members from another Circle K club are present",
	"An event in which at least two members from your Circle K club and at least two members from another non-Circle K Kiwanis Family club are present",
	"An event in which there must be a certain amount of members from your Circle K club and the same amount of members from another\
		Circle K/Kiwanis Family club present, depending on your Circle K club's number of dues paid members. Clubs with less than or equal to\
		20 members need a minimum of two members present; clubs with 21-30 members need a minimum of three memberrs present; and clubs with greater\
		than or equal to 31 members need a minimum of four members present",
	"An online webinar usualy hosted by the District Board for the District. This tag applies to both District and International webinars",
	"An event hosted by and for the Division, which is usually hosted by the respective Lieutenant Governor (and Divisional Board)",
	"An event hosted by and for the District",
	"An event hosted by Circle K International",
	"Any event hosted through your Circle K club"];
	showTagHints = false;


	constructor(private route: ActivatedRoute, private memberService: MemberService,
		private auth: AuthService, private _location: Location, public dialog: MatDialog,
		private builder: FormBuilder, private renderer: Renderer2, private cerfService: CerfService) {
		// this.route.data.subscribe(response => this.cerf = response.cerf);
		this.cerfId = this.route.snapshot.paramMap.get("id"); //this.route.snapshot.data['cerf'];
		cerfService.loadCerf(this.cerfId).subscribe(done => {
			this.cerf = cerfService.getCerf(); // move all calculations into the service so we don't need the actual cerf in here
			this.cerfForm = cerfService.getCerfForm();			
		});

		memberService.getMembers().subscribe(res => {
			this.filteredRoster = res;
		});

		console.log(this.cerfForm, this.cerf, this.route);
	}

	//id: number;
	user: User;
	cerf: Cerf;
	
	@ViewChild(MatSort) sort;
	@ViewChildren(MatTable) tables: QueryList<MatTable<any>>;

	get editable() {
		return (this.cerf.status == 0 && this.cerf.author._id == this.user._id) ||
		(this.cerf.status <= 1 && this.user.access.club == 2);
	}

	ngOnInit() {
	}

	 ngAfterContentInit() {
		// this.memberColumns = [{def: "member", title: "Name", footer: "+ Add Member", defaultFooter: ""},
	 // 		{def: "service", title: "Service", footer: "Service", defaultFooter: this.cerfForm.get('hoursPerAttendee.service')},
	 // 		{def: "leadership", title: "Leadership", footer: "Leadership", defaultFooter: this.cerfForm.get('hoursPerAttendee.leadership')},
	 // 		{def: "fellowship", title: "Fellowship", footer: "Fellowship", defaultFooter: this.cerfForm.get('hoursPerAttendee.fellowship')}]

		this.user = this.auth.getUser();

		// if(!this.editable) {
		// 	this.cerfForm.disable();
		// }
	}

	ngAfterViewInit() {

	}

	// inputListReady(name, event) {
	// 	this.cerfForm.setControl(name, event);
	// }

	addAttendance() {
		// Validate inputs

		this.attendanceArray.push(this.builder.group(this.newAttendance));
		this.newAttendance.name = "";
		this.newAttendance.service = this.cerfForm.get("hoursPerAttendee.service").value;
		this.newAttendance.leadership = this.cerfForm.get("hoursPerAttendee.leadership").value;
		this.newAttendance.fellowship = this.cerfForm.get("hoursPerAttendee.fellowship").value;

		this.tables.toArray()[0].renderRows();
		const element = this.renderer.selectRootElement("#attendanceFocus");
		setTimeout(() => element.focus(), 0);

		this.cerfForm.markAsDirty();
	}
	addKfam() {
		// Validate inputs

		this.kfamArray.push(this.builder.group(this.newKfam));
		Object.assign(this.newKfam, this.defaultKfam);

		this.tables.toArray()[1].renderRows();
		const element = this.renderer.selectRootElement("#kfamFocus");
		setTimeout(() => element.focus(), 0);

		this.cerfForm.markAsDirty();
	}
	addDriver() {
		// Validate inputs

		this.driverArray.push(this.builder.group(this.newDriver));
		Object.assign(this.newDriver, this.defaultDriver);

		this.tables.toArray()[2].renderRows();
		const element = this.renderer.selectRootElement("#driverFocus");
		setTimeout(() => element.focus(), 0);

		this.cerfForm.markAsDirty();
	}
	deleteAttendee(index) {
		this.attendanceArray.removeAt(index);
		this.tables.toArray()[0].renderRows();
		this.cerfForm.markAsDirty();
	}
	deleteKfam(index) {
		this.kfamArray.removeAt(index);
		this.tables.toArray()[1].renderRows();
		this.cerfForm.markAsDirty();
	}
	deleteDriver(index) {
		this.driverArray.removeAt(index);
		this.tables.toArray()[2].renderRows();
		this.cerfForm.markAsDirty();
	}

	get attendanceArray() {
		return this.cerfForm.get("attendees") as FormArray;
	}
	get kfamArray() {
		return this.cerfForm.get("kfamAttendance") as FormArray;
	}
	get driverArray() {
		return this.cerfForm.get("drivers") as FormArray;
	}

	filterMembers(event: any) {
		this.filteredRoster = this.memberService.filterMembers(event.target.value);
	}

	openTagHelp() {
		this.showTagHints = !this.showTagHints;
		// const dialogRef = this.dialog.open(TagsDialog);
		// let descriptions = "";
		// for(let i = 0; i < this.tagDescriptions.length; i++) {
		// 	descriptions += "<p><strong>" + this.tagNames[i] + "</strong>: " + this.tagDescriptions[i] + "</p>";
		// }
		// dialogRef.componentInstance.title = "Tag Descriptions";
		// dialogRef.componentInstance.htmlContent = "<div>" + descriptions + "</div>";
	}

	isLabelActive(label: string): boolean {
		return this.categoriesActive.includes(label);
	}

	get categories() {
		return (this.cerfForm.controls['categories'] as FormArray);
	}

	addRemoveTag(tag: string, isChecked: boolean)
	{
		const tagArray = this.cerfForm.controls.tags as FormArray;
		let index = tagArray.controls.findIndex(item => item.value == tag);

		if(isChecked && index == -1)
		{
			tagArray.push(new FormControl(tag));
		} else if(index > 0) {
			tagArray.removeAt(index);
		}
		this.cerfForm.get('tags').markAsDirty();
	}

	saveCerf() {
		if(this.cerf._id == "new")	// would it be cleaner to create a separate component for a new cerf? No, way too redundant
		{
			this.cerfService.dispatchNewCerf().subscribe(res => {
				if(res.success)
				{
					const id = res.result;
					this._location.replaceState("cerfs/" + id);
					this.cerf._id = id;

					this.cerfForm.markAsPristine();	// move to service
				} else {
					// Handle failure
				}
			});
		} else {
			this.cerfService.dispatchUpdate().subscribe(res => this.cerfForm.markAsPristine());
		}
	}

	deleteCerf() {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, { /* options? */	});
		dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				this.cerfService.deleteCerf().subscribe(res => {
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
		this.cerfForm.disable();
		this.cerfService.submitCerf().subscribe(res => {
			if(res.success)
				this.cerf.status = 1;	// goes in service
			this.pendingAction = false;
			if(this.editable) {
				this.cerfForm.enable();
			}
		},
		error => {
			console.log(error);
			window.alert("Failed Submitting!");
			this.pendingAction = false;
			if(this.editable) {
				this.cerfForm.enable();
			}
		});
	}

	unsubmitCerf() {
		this.pendingAction = true;
		this.cerfForm.disable();
		this.cerfService.unsubmitCerf().subscribe(res => {
			if(res.success)
				this.cerf.status = 0;	// goes in service
			this.pendingAction = false;
			if(this.editable) {
				this.cerfForm.enable();
			}
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
		this.cerfForm.disable();
		this.cerfService.addToMRF().subscribe(res => {
			if(res.success)
				this.cerf.status = 2;	// goes in service
			this.pendingAction = false;
			if(this.editable) {
				this.cerfForm.enable();
			}
		},
		error => {
			console.log(error);
			window.alert("Failed Approving!");
			this.pendingAction = false;
			this.cerfForm.enable();
		},
		() => {});
	}

	unapproveCerf() {
		this.pendingAction = true;
		this.cerfForm.disable();
		this.cerfService.removeFromMRF().subscribe(res => {
			if(res.success)
				this.cerf.status = 1;	// goes in service
			this.pendingAction = false;
			if(this.editable) {
				this.cerfForm.enable();
			}
		},
		error => {
			console.log(error);
			window.alert("Failed Unapproving!");
			this.pendingAction = false;
		},
		() => {});
	}


	/* Structure
	
	author_id
	chair_id
	club_id
	division_id
	name
	status
	tags: [ ]
	time: { start, end }
	labels: [ ]
	hoursPerAttendee: { service, leadership, fellowship }
	attendees: [{ _id }]
	unverifiedAttendees: [{ any_string }]
	overrideHours: [{ _id, service, leadership, fellowship }]
	color
	fundraised: { fa, kfh, ptp }

	*/

	private createReactiveForm(model: Cerf): FormGroup {
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

		// form.registerControl('time', this.builder.group(model.time));	// TODO: date validator
		// form.registerControl('tags', this.builder.array(model.tags));
		// form.registerControl('attendees', this.builder.array(model.attendees));
		// form.registerControl('hoursPerAttendee', this.builder.group(model.hoursPerAttendee));
		// form.registerControl('overrideHours', this.builder.array(model.overrideHours));
		// form.registerControl('fundraised', this.builder.group(model.fundraised));
		// form.registerControl('comments', this.builder.group(model.comments));
		// form.registerControl('categories', this.builder.array(model.categories));
		// form.registerControl('drivers', this.builder.group(model.drivers));
		console.log(form);
		return form;
	}

	private createCerf(model: Cerf): FormGroup {
		/* Fill in CERF with null values so we can at least create a form */
		/* We're assuming a Cerf IS passed in (i.e. has all the non-optional properties at least */
		let copyModel = JSON.parse(JSON.stringify(model));	// Cooking the data passes by reference, so nested arrays in objects are altered
		this.fillDefaults(copyModel);
		const form = this.createReactiveForm(copyModel); //this.cookData(copyModel);
		this.setValidators(form, [
			{ control: 'name', validator: Validators.required },
			{ control: 'hoursPerAttendee.service', validator: Validators.pattern('^[-]?[0-9]*[.]?[0-9]{0,2}$')},
			{ control: 'hoursPerAttendee.leadership', validator: Validators.pattern('^[-]?[0-9]*[.]?[0-9]{0,2}$')},
			{ control: 'hoursPerAttendee.fellowship', validator: Validators.pattern('^[-]?[0-9]*[.]?[0-9]{0,2}$')}
			]);
		// for(let x of (form.controls['attendees'] as FormArray).controls) {
		// 	x.setValidators([this.memberListValidator]);
		// }
		console.log(form);

		// this.memberService = form.get('hoursPerAttendee.service').value;
		// this.memberLeadership = form.get('hoursPerAttendee.leadership').value;
		// this.memberFellowship = form.get('hoursPerAttendee.fellowship').value;

		return form;
	}
	
	private fillDefaults(model: Cerf): void
	{
		// For structural changes, need to null-check because these won't be included in legacy CERFs
		if(!model.location) model.location = "";
		if(!model.contact) model.contact = "";
		if(!model.comments) {
			model.comments = { summary: "", strengths: "", weaknesses: "", improvements: ""};
		}
		if(!model.fundraised.amountRaised) {
			model.fundraised = { amountRaised: 0, amountSpent: 0, usedFor: ""};
		}
		if(!model.drivers) {
			model.drivers = [];
		}
		if(!model.kfamAttendance) {
			model.kfamAttendance = [];
		}
		if(!model.categories) {
			model.categories = [];
		}

		model.attendees = model.attendees.map(attendee => ({name: attendee._id, service: model.hoursPerAttendee.service,
	 		leadership: model.hoursPerAttendee.leadership, fellowship: model.hoursPerAttendee.fellowship})).concat(
	 		model.overrideHours.map(attendee => ({name: attendee.attendee_id, service: attendee.service, leadership: attendee.leadership, fellowship: attendee.fellowship})));
	 	
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

	// private memberListValidator(): ValidatorFn {
	// 	return (control: AbstractControl): { [key:string]: any } | null => {
	// 		return this.dataService.searchMember(control.value) ? null : {'notMember': {value: control.value}};
	// 	};
	// }

	public printForm() {
		console.log(this.cerfForm, this.cerfService.getCerfForm());	// CHECK - this.cerfForm and the form in the service reference the same thing
	}

	public getCerfFromForm() {
		let rawCerf = this.cerfForm.getRawValue();
		// Destructure the form in case 
		// Object.keys(rawCerf).forEach(key => {
		// 	if(rawCerf instanceof AbstractControl)
		// 		rawCerf[key] = rawCerf[key].getRawValue();
		// });

		/* Split up attendees and overrideHours */
		const defaultHours = this.cerfForm.get('hoursPerAttendee').value;
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
		if(!this.cerfForm.dirty) {	// No changes made. May have to add another condition to check for newly generated (unsaved)
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