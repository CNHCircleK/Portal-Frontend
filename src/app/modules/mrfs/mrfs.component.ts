import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mrf, Cerf } from '@core/models';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';


@Component({
	selector: 'app-mrfs',
	templateUrl: './mrfs.component.html',
	styleUrls: ['./mrfs.component.css', './_mrfs.component.scss'],
})

export class MrfsComponent {
	clubId: string;
	mrfList: Mrf[];

	constructor(private route: ActivatedRoute) {
		// Loaded in mrf-resolver guard
		this.mrfList = this.route.snapshot.data['mrfs'];

		// Displaying MRFs under a club (i.e. attach club id to the MRF call)
		// TODO: does back-routing within an MRF preserve the route param?
		this.route.queryParams.pipe(filter(params => params.clubId))
			      .subscribe(params => {
			      	this.clubId = params.clubId;
			      });
	}
}