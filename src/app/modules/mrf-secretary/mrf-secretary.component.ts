import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mrf } from '@core/data/mrf';
import { DataService } from '@core/data/data.service';

@Component({
	selector: 'app-mrf-secretary',
	templateUrl: './mrf-secretary.component.html',
	styleUrls: ['./mrf-secretary.component.css'],
})

export class MrfSecretaryComponent {
	resolvedData: Mrf[];
	resolve;

	constructor(private dataService: DataService, private router: ActivatedRoute) {
		this.resolve = this.router.data;
	}
}