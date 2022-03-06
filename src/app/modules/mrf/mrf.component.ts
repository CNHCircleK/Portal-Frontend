import { Component, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@app/modules/confirm-dialog/confirm-dialog.component';
import { Mrf, Cerf, User } from '@core/models';
import { MrfService, ApiService } from '@core/services';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as moment from 'moment';
import { AuthService } from '@app/core/authentication/auth.service';

@Component({
	selector: 'app-mrf',
	templateUrl: './mrf.component.html',
	styleUrls: ['./mrf.component.css', './_mrf.component.scss'],
	providers: [ MrfService ]	// Component scoped
})

export class MrfComponent {

	//id: number;
	mrf: Mrf;
	mrfForm: FormGroup;
	currentTab: string;
	openedPanels: number[] = [0, 0, 0, 0];
	user: User;
	pendingAction: boolean;

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

	@ViewChildren(MatTable) tables: QueryList<MatTable<any>>;

	constructor(private route: ActivatedRoute, private _location: Location, private builder: FormBuilder,
				private renderer: Renderer2, private mrfService: MrfService, private apiService: ApiService,
				public dialog: MatDialog, private auth: AuthService) {
		// this.mrf = this.route.snapshot.data['mrf'];
		let year = this.route.snapshot.paramMap.get("year");
		let month = this.route.snapshot.paramMap.get("month");
		let clubId = null;
		this.route.queryParams.pipe(filter(params => params.clubId))
			      .subscribe(params => {
			        console.log(params);

			        clubId = params.clubId;
			      });
		mrfService.loadMrf(year, month, clubId).subscribe(done => {
			this.mrf = mrfService.getMrf();
			this.mrfForm = mrfService.getMrfForm();
			if(this.apiService.user.club_id != this.mrf.club_id) {
				this.mrfForm.disable();
			}
		});
	}

	ngOnInit() {
	}

	ngAfterContentInit() {
		this.user = this.auth.getUser();
	}

	get editable() {
		return (this.mrf.status == 0 && this.user.access.club >= 2);
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
	get importedEventsArray() {
		return this.mrfForm.get('importedEvents') as FormArray;
	}

	saveMrf() {
		this.mrfService.dispatchUpdate().subscribe(result => {
			this.mrfForm.markAsPristine();
		});
	}

	canSubmit() {
		return !this.isSubmitted && this.user.access.club == 2;
	}

	canUnsubmit() {
		return this.isSubmitted && this.user.access.district > 0;
	}

	shouldShowDisabledSubmit() {
		return !this.canUnsubmit() && this.isSubmitted;
	}

	get submittedOnText() {
		return "Submitted on " + this.mrf.submissionTime;
	}

	get isSubmitted() {
		return this.mrf.status == 1;
	}

	askSubmitMrf() {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, { /* options? */	});
		dialogRef.componentInstance.confirmMessage = "Submit? You will need approval to edit again.";
		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				this.submitMrf();
			}
		})
	}

	private submitMrf() {
		this.pendingAction = true;
		this.mrfForm.disable();
		this.mrfService.submitMrf().subscribe(res => {
			if(res.success)
				this.mrf.status = 1;	// goes in service
			this.pendingAction = false;
			if(this.mrfForm) {
				this.mrfForm.enable();
			}
		},
		error => {
			console.log(error);
			window.alert("Failed Submitting!");
			this.pendingAction = false;
			if(this.editable) {
				this.mrfForm.enable();
			}
		});
	}

	unsubmitMrf() {
		this.pendingAction = true;
		this.mrfForm.disable();
		this.mrfService.unsubmitMrf().subscribe(res => {
			if(res.success)
				this.mrf.status = 0;	// goes in service
			this.pendingAction = false;
			if(this.editable) {
				this.mrfForm.enable();
			}
		},
		error => {
			console.log(error);
			window.alert("Failed Unsubmitting!");
			this.pendingAction = false;
		},
		() => {});
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
		return this.mrf;
	}

	goBack() {
		if(!this.mrfForm.dirty) {	// No changes made. May have to add another condition to check for newly generated (unsaved)
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
}