import { Injectable } from '@angular/core';
import { Mrf, Cerf } from '@core/models';
import { ApiService } from './api.service';

@Injectable()
export class MrfService {
	private mrf: Mrf;

	constructor(private apiService: ApiService)
	{

	}

	loadMrf(id: string) {
		// make api call and adapt it to local variable
	}

	dispatchMrf() {

	}

	getMrf() {
		return this.mrf;
	}

	/*
	getters for identifiable subcomponents, e.g. meetings
	*/

	setMrf(mrf: Mrf) {
		// Initial thought would be to tie this local object to the DOM, but actually we can 
		this.mrf = mrf;
	}
	/*
	setters for identifiable subcomponents, e.g. meetings
	*/
}