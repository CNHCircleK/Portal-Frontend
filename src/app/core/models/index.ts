import { Cerf } from './cerf.model';

export * from './cerf.model';
export * from './mrf.model';
export * from './member.model';
export * from './user.model';
export * from './club.model';
export * from './division.model';


// Model-Adapter pattern for consuming API in a Typescript manner: https://blog.florimondmanca.com/consuming-apis-in-angular-the-model-adapter-pattern
// export interface IAdapt<T> {
// 	adapt(item: any): T;
// }

export class Maker {
	static cerfMaker(item: any): Cerf {
		return new Cerf(
			item._id,
			item.club_id,
			item.division_id,
			item.name,
			item.time,
			item.author,
			item.chair,
			item.location,
			item.contact,
			item.tags,
			item.attendees,
			item.unverifiedAttendees,
			item.hoursPerAttendee,
			item.overrideHours,
			item.fundraised,
			item.drivers,
			item.comments,
			item.kfamAttendance,
			item.categories,
			item.status
		)
	}
}