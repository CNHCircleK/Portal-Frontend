import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mrf, Cerf } from '@core/models';
import { DataService } from '@core/data/data.service';

@Component({
	selector: 'app-mrf-secretary',
	templateUrl: './mrf-secretary.component.html',
	styleUrls: ['./mrf-secretary.component.css', './_mrf-secretary.component.scss'],
})

export class MrfSecretaryComponent {
	mrfList: Mrf[];

	constructor(private dataService: DataService, private router: ActivatedRoute) {
		this.mrfList = this.router.snapshot.data['mrfs'];
	}
}