import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
	displayedColumns: string[] = ["name", "access"];

	constructor(private dataService: DataService, private auth: AuthService, private route: ActivatedRoute, private dialog: MatDialog) {
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
		this.dataService.getMembers(true).subscribe(res => {
			this.members=res;
			this.list.data=res;
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