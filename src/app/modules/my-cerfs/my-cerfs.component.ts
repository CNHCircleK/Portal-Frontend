import { Component, Input, Directive, Renderer2, ElementRef, ViewChild } from '@angular/core';
// import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cerf } from '@core/data/cerf';
import { DataService } from '@core/data/data.service';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';

import { Observable, zip } from 'rxjs';


@Component({
	selector: 'app-my-cerfs',
	templateUrl: './my-cerfs.component.html',
	styleUrls: ['./my-cerfs.component.css'],
})

export class MyCerfsComponent {
	mrfView: boolean = false;
	resolvedData: Cerf[] = [];
	resolve;

	constructor(private route: ActivatedRoute, private dataService: DataService,
		private auth: AuthService, private _location: Location) {
		// this.route.data.subscribe(response => this.resolvedData = response.myCerfs);
		this.resolvedData = this.route.snapshot.data['myCerfs'];
	}

	ngOnInit() {
		
	}
}