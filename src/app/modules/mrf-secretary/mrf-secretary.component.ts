import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mrf } from '@core/data/mrf';
import { DataService } from '@core/data/data.service';

@Component({
	selector: 'app-mrf-secretary',
	templateUrl: './mrf-secretary.component.html',
	styleUrls: ['./mrf-secretary.component.css', './_mrf-secretary.component.scss'],
})

export class MrfSecretaryComponent {
	resolvedData: Mrf[];
	resolve;
	list = [];

	currentTab: string;	// TODO: change for a state + function to switch between months

	constructor(private dataService: DataService, private router: ActivatedRoute) {
		this.resolvedData = this.router.snapshot.data['secretaryMrfs'];

		this.currentTab = "august";

	}
}