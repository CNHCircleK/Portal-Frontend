import { Component, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator, MatSort, MatTableDataSource, MatSortable } from '@angular/material';

import { Observable } from 'rxjs';
import { DataService } from '@core/data/data.service';
import { Cerf } from '@core/data/cerf';

@Component({
	selector: 'app-cerflist',
	templateUrl: './cerflist.component.html',
	styleUrls: ['./cerflist.component.css', './_cerflist.component.scss'],
})

export class CerfListComponent {
	displayedColumns = ["event_name", "time.start", "search"];	// Add "status" to display notification of status
	list: MatTableDataSource<Cerf>;

	@ViewChild(MatPaginator) paginator: MatPaginator;
  	@ViewChild(MatSort) sort: MatSort;

  	@Input() pendingCerfs: boolean;	// Change some logic if viewing through an MRF
  	@Input() cerfList: Cerf[];
  	@Input() pagination: boolean;

	constructor(private dataService: DataService, private router: Router) {
		// this.getCerfs();
	}

	ngOnInit() {
		if(this.pendingCerfs)
			this.displayedColumns.splice(2, 0, "status");
		if(this.cerfList) {
			this.list = new MatTableDataSource(this.cerfList);
		}
		this.pagination = this.cerfList.length > 10 || this.pagination;	// even if not specified, automatically attach pagination when there's enough elements
	}

	ngAfterViewInit() {
		if(this.list) {
			if(this.pagination)
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

	clickRow(row) {
		this.router.navigate(['/cerf', row._id]);
	}
}