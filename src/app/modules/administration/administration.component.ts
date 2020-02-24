import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MemberService } from '@core/services';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/models';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
	selector: 'app-administration',
	templateUrl: './administration.component.html',
	styleUrls: ['./administration.component.css', './_administration.component.scss'],
	animations: [
	    trigger('detailExpand', [
	      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
	      state('expanded', style({height: '*'})),
	      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
	    ]),
	  ]
})

export class ClubAdministrationComponent {

	members: Member[];
	club: string;

	@ViewChild(MatPaginator) paginator;
	@ViewChild(MatSort) sort;
	list: MatTableDataSource<Member>;
	displayedColumns: string[] = ["name", "year", "position", "code", "actions"];

	memberRegistrationMode: boolean = false;
	gettingCode: boolean = false;

	mockData = {	// replace with api call to /club/administration
		meeting: {
			frequency: "",
			date: "",
			time: {
				start: "",
				end: ""
			},
			location: ""
		},
		advisors: {
			faculty: {
				name: "Nguyet",
				phone: "",
				address: "",
				email: ""
			},
			kiwanis: {
				name: "",
				phone: "",
				address: "",
				email: ""
			}
		},
		members: [
			{
				name: {
					first: "Chris",
					last: "Lam",
					_id: "something"
				},
				phone: "",
				address: "",
				email: "",
				birthday: "",
				grad_year: "",
				pay_date: "",
				renew_date: "",
				alumni: false,
				active: true,
				position: "Technology Chair",
				board: {
					eboard: false,
					aboard: true
				}
			},
			{
				name: {
					first: "Nhi",
					last: "Truong",
					_id: "something"
				},
				phone: "",
				address: "",
				email: "",
				birthday: "",
				grad_year: "",
				pay_date: "",
				renew_date: "",
				alumni: false,
				active: true,
				position: "Graphics Chair",
				board: {
					eboard: false,
					aboard: true
				}
			}
		]
	}

	expandedMember = null;

	constructor(private memberService: MemberService,
		private auth: AuthService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog,
		private snackBar: MatSnackBar) {
		// this.members = this.route.snapshot.data['members'];
		// console.log(this.members);

		this.clubId = this.auth.getUser().club_id;

		this.route.queryParams.pipe(filter(params => params.clubId))
	      .subscribe(params => {
	      	if(params.clubId) {
		        this.clubId = params.clubId;
		        // Refresh the page when param-only change (going to a different clubId param)
		        router.routeReuseStrategy.shouldReuseRoute = () => false;
	      	}
	      	memberService.getMembers(this.clubId).subscribe((res) => {
	      		console.log(res);
	      		this.members = res;
	      	});
	      });
	}

	ngOnInit() {
		this.list = new MatTableDataSource(this.members);
		// this.list = new MatTableDataSource(this.mockData.members);
	}

	ngAfterViewInit() {
		this.list.paginator = this.paginator;
		this.list.sort = this.sort;
	}

	applyFilter(filterValue: string) { 
		filterValue = filterValue.trim();
		filterValue = filterValue.toLowerCase();
		this.list.filter = filterValue;
	}

	updateList() {
		this.memberService.getMembers().subscribe(res => {
			this.members=res || [];
			this.list.data=res || [];
		});
	}

	loadTooltip(row) {
		console.log(row);
		return row;
	}

	newMember() {
		const dialogRef = this.dialog.open(DialogNewMember, {

		});

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				console.log(result);
				this.memberService.newMember(result.firstName, result.lastName).subscribe(res => this.updateList());
			}
		});
	}

	getCode(i) {
		console.log(i);
		this.memberService.getRegistrationCode(this.members[i]._id).subscribe(res => this.members[i].code = res);
	}

	getMemberCode(row) {
		if(!this.memberRegistrationMode)
			return;
		this.gettingCode = true;
		this.memberRegistrationMode = false;
		this.memberService.getRegistrationCode(row._id).subscribe( (res:any) => {
			console.log(res);
			if(res.success) {
				this.members[this.members.findIndex(member => member._id == row._id)]['code']=res.result;
				this.list.data = this.members;
			} else if(res.error) {
				this.snackBar.open(res.error, 'close', {duration: 2000});
			} else {
				this.snackBar.open('Failed getting code!', 'close', {duration: 2000});
			}
			this.gettingCode = false;
		});
	}

}



@Component({
	selector: 'dialog-new-member',
	templateUrl: 'dialog-new-member.html'
})
export class DialogNewMember {
	first: string;
	last: string;

	constructor(public dialogRef: MatDialogRef<DialogNewMember>) {

	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}