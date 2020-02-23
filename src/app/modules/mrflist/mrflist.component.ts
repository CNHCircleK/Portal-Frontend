import { Component, ViewChild, Input } from '@angular/core';
import { Mrf } from '@core/models';
import { AuthService } from '@core/authentication/auth.service';
import { ApiService } from '@core/services';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
	selector: 'app-mrflist',
	templateUrl: './mrflist.component.html',
	styleUrls: ['./mrflist.component.css', './_mrflist.component.scss'],
})

export class MrfListComponent {

	currentTab: string;

	displayedColumns;
	list: MatTableDataSource<Mrf>;

	static readonly NONE = 0;
	static readonly CLUB = 1;
	static readonly DIVISION = 2;
	static readonly DISTRICT = 3;
	extraList: number;
	currentDivision: string = "";
	currentClub: string = "";

	divisions = [];
	clubs = [];

	@ViewChild(MatPaginator) paginator;
	@ViewChild(MatSort) sort;

	@Input() mrfList: Mrf[];
	@Input() clubId: string = null;
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	constructor(private auth: AuthService, private apiService: ApiService) {
		const user = auth.getUser();
		this.extraList = user.access.district > 0 ? MrfListComponent.DISTRICT : (user.access.division > 0 ? MrfListComponent.DIVISION : MrfListComponent.NONE);

		if(this.extraList == MrfListComponent.DISTRICT)
		{
			apiService.getDivisions().subscribe( (res: {success, result}) => {
				if(res.success)
					this.divisions = res.result;
				console.log(res);
			});
		}
		if(this.extraList == MrfListComponent.DIVISION)
		{
			apiService.getClubs().subscribe( (res: {success, result}) => {
				if(res.success)
					this.clubs = res.result;
			})
		}

		this.currentTab = "mrfs";
	}

	ngOnInit() {
		this.list = new MatTableDataSource(this.mrfList);
		this.displayedColumns = ['month', 'year']//, 'action']
		// if(this.display) this.displayedColumns = this.displayedColumns.concat(this.display);
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

	showDivisions() {
		this.currentTab = "divisions";
	}

	showClubs(row) {
		this.currentDivision = row.name;
		this.apiService.getClubs(row._id).subscribe( (res: {success, result}) => {
			if(res.success)
				this.clubs = res.result;
			this.currentTab = "clubs";
		})
	}
}