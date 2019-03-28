import { Component, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator, MatSort, MatTableDataSource, MatSortable } from '@angular/material';

import { Observable } from 'rxjs';
import { DataService } from '@core/data/data.service';
import { Cerf } from '@core/models';

@Component({
	selector: 'app-cerflist',
	templateUrl: './cerflist.component.html',
	styleUrls: ['./cerflist.component.css', './_cerflist.component.scss'],
})

export class CerfListComponent {
	displayedColumns = ["name", "time.start", "author", "status"];	// Add "status" to display notification of status
	list: MatTableDataSource<Cerf>;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

  	@Input() pendingCerfs: boolean;	// Change some logic if viewing through an MRF
  	@Input() pagination: boolean;
  	@Input() cerfList: Cerf[];
		/*
			"_id": "5b74e046245fad079ec5ced4",
            "name": "New Even",
            "time": {
                "start": "2018-08-16T02:22:57.000Z",
                "end": "2018-08-16T02:22:57.000Z"
            },
            "tags": [],
            "totals": {
                "service": 0,
                "leadership": 0,
                "fellowship": 0,
                "members": 0
            }
            */


    constructor(private dataService: DataService, private router: Router) {
		// this.getCerfs();
		
	}

	ngOnInit() {
		if(this.pendingCerfs)
			this.displayedColumns.splice(2, 0, "status");
		if(this.cerfList) {
			this.list = new MatTableDataSource(this.cerfList);
			this.pagination = this.cerfList.length > 10 || this.pagination;	// even if not specified, automatically attach pagination when there's enough elements
		}
	}

	ngAfterViewInit() {
		if(this.list) {
			this.list.sort = this.sort;
			this.list.sortingDataAccessor = (data, header) => {
				switch (header) {
					case "time.start":
						return new Date(data.time.start);
					
					default:
						return data[header]; // https://github.com/angular/material2/issues/9966
				}
			}
			if(this.pagination)
				this.list.paginator = this.paginator;
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