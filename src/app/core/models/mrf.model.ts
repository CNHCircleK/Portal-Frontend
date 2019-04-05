import { Cerf } from './cerf.model';

export class Mrf {
	constructor(
		public _id: string,
		public club_id: string,
		public division_id: string,
		public year: number,
		public month: number,
		public status: number,
		public submissionTime: Date,
		public numDuesPaid: number,
		public events: {name: string, time: { start: Date, end: Date }, totals: { service: number, leadership: number, fellowship: number, members: number }}[],
		public importedEvents: Cerf[],	// a Cerf Summary (id, totals, members)?
		public goals: string[],
		public meetings: {date: string, attendance: { numMembers: number, numNonHomeMembers: number, numKiwanis: number, numGuests: number },
          		advisorAttended: { faculty: boolean, kiwanis: boolean }}[],
    	public boardMeetings: { date: string, attendance: { numBoard: number, numGuests: number }}[],
		public dcm: { date: Date, presidentAttended: boolean, members: number, nextDcmDate: Date },
		public communications: { ltg: string, dboard: string },
    	public fundraising: { source: string, ptp: number, kfh: number, fa: number, other: number, admin: number, fromEventReport: boolean }[],
		public kfamReport: boolean,
	) {}
}

export class MrfListEntry {
	constructor(
		public _id: string,
		public name: string,
		public status: number,
		public year: number,
		public month: number,
		public submissionTime: Date
	) {}
}