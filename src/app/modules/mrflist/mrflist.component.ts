import { Component, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Mrf } from '@core/data/mrf';
import { DataService } from '@core/data/data.service';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
	selector: 'app-mrflist',
	templateUrl: './mrflist.component.html',
	styleUrls: ['./mrflist.component.css', './_mrflist.component.scss'],
})

export class MrfListComponent {

	currentTab: string;

	displayedColumns;
	list: MatTableDataSource<Mrf>;

	@ViewChild(MatPaginator) paginator;
	@ViewChild(MatSort) sort;

	@Input() mrfList: Mrf[];
	// @Input() display: string[];
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	constructor(private dataService: DataService, private router: Router) {
		this.currentTab = 'secretary';
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
}