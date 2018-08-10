import { Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cerf } from '@core/data/cerf';
import { Mrf } from '@core/data/mrf';
import { DataService } from '@core/data/data.service';
import { Location } from '@angular/common';

@Component({
	selector: 'app-mrf',
	templateUrl: './mrf.component.html',
	styleUrls: ['./mrf.component.css', './_mrf.component.scss']
})

export class MrfComponent {

	//id: number;
	mrf: Mrf;
	cerfs: Cerf[] = [];
	mrfForm: FormGroup;
	currentTab: string;

	constructor(private route: ActivatedRoute, private dataService: DataService,
		private _location: Location, private builder: FormBuilder) {
		this.mrf = this.route.snapshot.data['mrf'];
		this.mrfForm = this.cookData(this.mrf);
		console.log(this.mrfForm);
		this.currentTab = "main";
	}

	ngOnInit() {
		// if(this.mrf.data)
		// 	this.cerfs=this.mrf.data.events;
		// let id = this.route.snapshot.params.id;
		// this.dataService.getMrfById(id).subscribe(mrf => this.mrf = mrf);
	}


	private createCerf(model: Mrf): FormGroup {
		/* Fill in CERF with null values so we can at least create a form */
		/* We're assuming a Cerf IS passed in (i.e. has all the non-optional properties at least */
		this.fillDefaults(model);
		const form = this.cookData(model);
		this.setValidators(form, [
			]);
		return form;
	}

	private fillDefaults(model: Mrf): void
	{
		// Set default values of a Partial<Cerf>
	}

	private cookData(model: Object): FormGroup
	{
		let formGroup: { [id: string]: AbstractControl; } = {};
		Object.keys(model).forEach(key => {
			formGroup[key] = 	model[key] instanceof Date ? this.builder.control(model[key]) : // making formgroups out of single Dates doesn't make sense
			model[key] instanceof Array ? this.builder.array(this.helperCookArray(model[key])) :
			(model[key] instanceof Object ? this.cookData(model[key]) : this.builder.control(model[key]));
			// Note, Arrays are objects but objects are not arrays
		});
		return this.builder.group(formGroup);
	}

	private  helperCookArray(arr: any[]): any[] {
		arr.forEach((element, index, array) => array[index] = this.cookData(element));	// Dangerously infinite loop
		return arr;
	}

	private setValidators(form: FormGroup, validators: {control: string, validator: ValidatorFn | ValidatorFn[]}[]) {
		validators.forEach((element, index, array) => {
			form.get(element.control).setValidators(element.validator);
			/* Check that this method will add new validators to exist validators in case when passed validators will be in array.
			In other case it will override previous validators. Here is the source:
				function coerceToValidator(validator: ValidatorFn | ValidatorFn[]): ValidatorFn {
					return Array.isArray(validator) ? composeValidators(validator) : validator;
				}
				*/
			})
	}

	public getMrfFromForm() {
		let rawMrf = this.mrfForm.getRawValue();
		console.log(rawMrf);
		Object.assign(this.mrf, rawMrf);
		console.log(this.mrf);
		return this.mrf;
	}

	goBack() {
		this._location.back();
	}
}