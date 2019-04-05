import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mrf } from '@core/models';

@Component({
	selector: 'app-mrf-division',
	templateUrl: './mrf-division.component.html',
	styleUrls: ['./mrf-division.component.css', './_mrf-division.component.scss'],
})

export class MrfDivisionComponent {
	resolvedData: Mrf[];
	resolve;

	constructor(private router: ActivatedRoute) {
		this.resolvedData = this.router.snapshot.data['divisionMrfs'];
	}
}