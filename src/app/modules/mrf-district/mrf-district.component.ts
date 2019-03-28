import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mrf } from '@core/models';
import { DataService } from '@core/data/data.service';

@Component({
	selector: 'app-mrf-district',
	templateUrl: './mrf-district.component.html',
	styleUrls: ['./mrf-district.component.css', './_mrf-district.component.scss'],
})

export class MrfDistrictComponent {
	resolvedData: Mrf[];
	resolve;

	constructor(private dataService: DataService, private router: ActivatedRoute) {
		this.resolvedData = this.router.snapshot.data['districtMrfs'];
	}
}