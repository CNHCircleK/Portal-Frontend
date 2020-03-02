import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '@core/services';
import { AuthService } from '@core/authentication/auth.service';
import { Member, Club } from '@core/models';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-clubs',
	templateUrl: './clubs.component.html',
	styleUrls: ['./clubs.component.css', './_clubs.component.scss']
})
export class ClubsComponent {

	clubs: Club[] = [];
	list: MatTableDataSource<Club>;
	displayedColumns: string[] = ["name", "action"];

	@Input() division = null;

	constructor(private apiService: ApiService, private auth: AuthService, private route: ActivatedRoute, private dialog: MatDialog) {
		if(!this.division) // To allow prop insertion if it's still used somewhere. Remove later
		{
			this.route.queryParams.pipe(filter(params => params.divisionId))
		      .subscribe(params => {
		      	this.division = params.divisionId;
		      });
	  	}
	  	if(!this.division)
	  		this.division = this.apiService.user.division_id;
		this.apiService.getClubs(this.division).subscribe( (res: any) => {
			this.clubs = res.result;
		});
	}

	ngOnInit() {
		this.list = new MatTableDataSource(this.clubs);
	}

	ngAfterViewInit() {
	}
	
	updateList() {
		this.apiService.getClubs().subscribe(res => {
			this.clubs=res.result;
			this.list.data=res.result;
		});
	}

	newClub() {
		const dialogRef = this.dialog.open(DialogNewClub, {

		});

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				this.apiService.newClub(result.name, this.division).subscribe(res => this.updateList());
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