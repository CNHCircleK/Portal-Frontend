import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MemberService } from '@core/services';
import { ApiService } from '@core/services';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/models';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


type Division = {_id: string, name: string};

@Component({
	selector: 'app-divisions',
	templateUrl: './divisions.component.html',
	styleUrls: ['./divisions.component.css', './_divisions.component.scss']
})
export class DivisionsComponent {

	divisions: Division[] = [];
	list: MatTableDataSource<Division>;
	displayedColumns: string[] = ["name"];

	constructor(private apiService: ApiService, private memberService: MemberService, private dialog: MatDialog, private snackBar: MatSnackBar) {
		// this.club = this.auth.getUser().club_id;
		this.apiService.getDivisions().subscribe( (res: any) => {
			this.divisions = res.result;
		})
	}

	ngOnInit() {
		this.list = new MatTableDataSource(this.divisions);
	}

	ngAfterViewInit() {

	}

	newMember() {
		
	}


	openDivision(row) {
		console.log(row);
	}

}



// @Component({
// 	selector: 'dialog-new-member',
// 	templateUrl: 'dialog-new-member.html'
// })
// export class DialogNewMember {
// 	first: string;
// 	last: string;

// 	constructor(public dialogRef: MatDialogRef<DialogNewMember>) {

// 	}

// 	onNoClick(): void {
// 		this.dialogRef.close();
// 	}
// }