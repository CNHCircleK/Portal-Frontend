// import { Member } from './member.model';

export class Cerf {

	constructor(
		public _id: string,
		public name: string,
		public club_id: string,
		public division_id: string,
		public time: { start: Date, end: Date },
		public author: { _id: string, name: { first: string, last: string } },
		public chair: { _id: string, name: string },
		public location: string,
		public contact: string,
		public tags: string[],
		public attendees: { _id?: string, name: ({ first: string, last: string } | string), service?: number, leadership?: number, fellowship?: number }[],
		public hoursPerAttendee: {
			service: number,
			leadership: number,
			fellowship: number
		},
      public overrideHours: {
      attendee: {_id: string},
			service: number,
			leadership: number,
			fellowship: number
		}[],
		public fundraised: {
			amountRaised: number,
			amountSpent: number,
			usedFor: string
		},
		public drivers: {
			driver: string,
			milesFrom: number,
			milesTo: number
		}[],
		public comments: {
			summary: string,
			strengths: string,
			weaknesses: string,
			improvements: string
		},
		public kfamAttendance: {
			org: string,
			numAttendees: number
		}[],
		public categories: string[],
		public status: number
	) {}
}

export class CerfListEntry {
	constructor(
		public _id: string,
		public name: string,
		public status: number,
		public time: { start: Date, end: Date },
		public author: { name: string }[]
	) {}
}

// // export interface Cerf extends Partial<CerfData> {
// 	// 	_id: string,
// 	// 	name: string,
// 	// 	status: number,
// 	// 	time: {
// 		// 		start: Date,
// 		// 		end: Date
// 		// 	},
// 		// 	// author
// 		// }

// 		export interface CerfData {
// 			readonly club_id: string,
// 			readonly division_id: string,
// 			author: { _id: string, name: { first: string, last: string } },
// 			chair: { _id: string, name: { first: string, last: string } },
// 			location: string,
// 			contact: string,
// 			tags: string[],
// 			attendees: { _id?: string, name: ({ first: string, last: string } | string), service?: number, leadership?: number, fellowship?: number }[],
// 			hoursPerAttendee: {
// 				service: number,
// 				leadership: number,
// 				fellowship: number
// 			}
// 			overrideHours: {
// 				attendee_id: string,
// 				service: number,
// 				leadership: number,
// 				fellowship: number
// 			}[]
// 			fundraised: {
// 				amountRaised: number,
// 				amountSpent: number,
// 				usedFor: string
// 			}
// 			drivers: {
// 				driver: string,
// 				milesFrom: number,
// 				milesTo: number
// 			}[]
// 			comments: {
// 				summary: string,
// 				strengths: string,
// 				weaknesses: string,
// 				improvements: string
// 			},
// 			kfamAttendance: {
// 				org: string,
// 				numAttendees: number
// 			}[]
// 			categories: string[],
// 		}
