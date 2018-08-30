import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-clubs',
	templateUrl: './clubs.component.html',
	styleUrls: ['./clubs.component.css', './_clubs.component.scss']
})

export class ClubsComponent {

	division: string;
	clubs: string[];

	@ViewChild(MatPaginator) paginator;
	@ViewChild(MatSort) sort;
	list: MatTableDataSource<string>;
	displayedColumns: string[] = ["club_name", "id", "search"];

	constructor(private dataService: DataService, private auth: AuthService, private route: ActivatedRoute, private dialog: MatDialog) {
		this.clubs = this.route.snapshot.data['clubs'];
		console.log(this.clubs);

		this.auth.getUser().subscribe(user => this.division = user.division_id);
	}

	ngOnInit() {
		this.list = new MatTableDataSource(this.clubs);
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
		this.dataService.getClubs(true).subscribe(res => {
			this.clubs=res;
			this.list.data=res;
		});
	}

	newClub() {
		const dialogRef = this.dialog.open(DialogNewClub, {

		});

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				console.log(result);
				this.dataService.newClub(result.name).subscribe(res => this.updateList());
			}
		});
	}
}



@Component({
	selector: 'dialog-new-club',
	templateUrl: 'dialog-new-club.html'
})
export class DialogNewClub {
	divName: string;

	constructor(public dialogRef: MatDialogRef<DialogNewClub>) {

	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}