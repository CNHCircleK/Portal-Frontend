import { Component, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Observable } from 'rxjs';
import { DataService } from '@core/data/data.service';
import { Cerf } from '@core/data/cerf';

@Component({
	selector: 'app-cerflist',
	templateUrl: './cerflist.component.html',
	styleUrls: ['./cerflist.component.css', './cerflist_theme.scss'],
})

export class CerfListComponent {
	displayedColumns = ["name", "action"];	// Add "status" to display notification of status
	list: MatTableDataSource<Cerf>;

	@ViewChild(MatPaginator) paginator: MatPaginator;
  	@ViewChild(MatSort) sort: MatSort;

  	@Input() mrfId: number;	// Change some logic if viewing through an MRF
  	@Input() cerfList: Cerf[];

	constructor(private dataService: DataService, private router: Router) {
		// this.getCerfs();
	}

	ngOnInit() {
		if(this.cerfList)
			this.list = new MatTableDataSource(this.cerfList);
	}

	ngAfterViewInit() {
		if(this.list) {
			this.list.paginator = this.paginator;
			this.list.sort = this.sort;
		}
	}

	applyFilter(filterValue: string) {
		if(this.list) {
		    filterValue = filterValue.trim(); // Remove whitespace
		    filterValue = filterValue.toLowerCase(); // list defaults to lowercase matches
		    this.list.filter = filterValue;
		}
	}

	newCerf() {
		let cerf: Cerf = this.dataService.newCerf();
		if(this.mrfId)
			this.dataService.addCerfToMrf(cerf, this.mrfId);
		this.router.navigate(['/cerf', cerf._id]);
	}
	
	removeCerfFromMrf(id: number) {
		this.dataService.removeCerf(this.mrfId, id);
	}
}