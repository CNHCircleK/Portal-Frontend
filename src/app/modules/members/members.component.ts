import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MemberService } from '@core/data/member.service';
import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';

@Component({
	selector: 'app-members',
	templateUrl: './members.component.html',
	styleUrls: ['./members.component.css', './_members.component.scss']
})

export class MembersComponent {

	members: Member[];
	club: string;

	@ViewChild(MatPaginator) paginator;
	@ViewChild(MatSort) sort;
	list: MatTableDataSource<Member>;
	displayedColumns: string[] = ["name", "access", "code"];

	memberRegistrationMode: boolean = false;
	gettingCode: boolean = false;

	constructor(private dataService: DataService, private memberService: MemberService,
		private auth: AuthService, private route: ActivatedRoute, private dialog: MatDialog,
		private snackBar: MatSnackBar) {
		this.members = this.route.snapshot.data['members'];
		console.log(this.members);

		this.auth.getUser().subscribe(user => this.club = user.club_id);
	}

	ngOnInit() {
		this.list = new MatTableDataSource(this.members);
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
			this.members=res.result || [];
			this.list.data=res.result || [];
		});
	}

	newMember() {
		const dialogRef = this.dialog.open(DialogNewMember, {

		});

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				console.log(result);
				this.dataService.addMember(result.firstName, result.lastName).subscribe(res => this.updateList());
			}
		});
	}

	getMemberCode(row) {
		if(!this.memberRegistrationMode)
			return;
		this.gettingCode = true;
		this.memberRegistrationMode = false;
		this.dataService.getMemberCode(row._id).subscribe( (res:any) => {
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