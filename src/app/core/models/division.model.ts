import { Club } from './club.model'

export class Division {

	constructor(
		public _id: string,
		public name: string,
		public clubs: Club[]
	){}
}