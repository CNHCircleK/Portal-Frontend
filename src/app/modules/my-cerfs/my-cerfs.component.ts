import { Component, Input, Directive, Renderer2, ElementRef, ViewChild } from '@angular/core';
// import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cerf, Member } from '@core/models';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from '@core/authentication/auth.service';

import { Observable, zip } from 'rxjs';


@Component({
	selector: 'app-my-cerfs',
	templateUrl: './my-cerfs.component.html',
	styleUrls: ['./my-cerfs.component.css', './_my-cerfs.component.scss'],
})

export class MyCerfsComponent {
	displayedColumns = ["name", "time.start", "author", "status"];	// Add "status" to display notification of status
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@Input() pagination: boolean;

	mrfView: boolean = false;
	cerfs: Cerf[] = [];
	list: MatTableDataSource<Cerf>;
	resolve;

	constructor(private route: ActivatedRoute, private router: Router,
		private auth: AuthService, private _location: Location) {
		// this.route.data.subscribe(response => this.resolvedData = response.myCerfs);
		this.cerfs = this.route.snapshot.data['myCerfs'];
		this.cerfs.concat(this.route.snapshot.data['pendingCerfs']);
	}

	ngOnInit() {
		if(this.cerfs) {
			this.list = new MatTableDataSource(this.cerfs);
			this.pagination = this.cerfs.length > 10 || this.pagination;	// even if not specified, automatically attach pagination when there's enough elements
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

	newCerf() {
		this.router.navigate(['/cerf', 'new']);	// Router resolver handles generating the blank template
		//if(this.mrfView)
			//this.dataService.addCerfToMrf(cerf, this.mrfView);
		
	}
}