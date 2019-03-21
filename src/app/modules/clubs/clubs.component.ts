import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '@core/data/data.service';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

type Club = { _id: string, name: string };

@Component({
	selector: 'app-clubs',
	templateUrl: './clubs.component.html',
	styleUrls: ['./clubs.component.css', './_clubs.component.scss']
})
export class ClubsComponent {

	clubs: Club[] = [];
	list: MatTableDataSource<Club>;
	displayedColumns: string[] = ["name"];

	@Input() division = null;

	constructor(private dataService: DataService, private auth: AuthService, private route: ActivatedRoute, private dialog: MatDialog) {
		// this.division = this.auth.getUser().division_id;
		this.dataService.getClubs(this.division).subscribe( (res: any) => {
			this.clubs = res.result;
		});	// if null, it'll grab user's division
	}

	ngOnInit() {
		this.list = new MatTableDataSource(this.clubs);
	}

	ngAfterViewInit() {
	}
	
	updateList() {
		this.dataService.getClubs().subscribe(res => {
			this.clubs=res;
			this.list.data=res;
		});
	}

	newClub() {
		const dialogRef = this.dialog.open(DialogNewClub, {

		});

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
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