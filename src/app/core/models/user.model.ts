

export class User {
	constructor(public name: string, public _id: string, public club_id: string, public division_id: string,
				public access: {club: number, division: number, district: number}) {}
	// TODO: abstract access numbers as enum levels (officer, secretary, ltg)? What's not allowed to overlap?
}