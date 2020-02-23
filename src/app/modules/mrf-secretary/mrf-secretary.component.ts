import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mrf, Cerf } from '@core/models';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';


@Component({
	selector: 'app-mrf-secretary',
	templateUrl: './mrf-secretary.component.html',
	styleUrls: ['./mrf-secretary.component.css', './_mrf-secretary.component.scss'],
})

export class MrfSecretaryComponent {
	clubId: string;
	mrfList: Mrf[];

	constructor(private route: ActivatedRoute) {
		this.mrfList = this.route.snapshot.data['mrfs'];

		// Displaying MRFs under a club (i.e. attach club id to the MRF call)
		// TODO: does back-routing within an MRF preserve the route param?
		this.route.queryParams.pipe(filter(params => params.clubId))
			      .subscribe(params => {
			        console.log(params); // {order: "popular"}

			        this.clubId = params.clubId;
			      });
	}
}