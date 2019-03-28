import { Cerf } from './cerf.model';

export interface Mrf2 {
	_id: number,
	year: number,
	month: number,
	status: 0,	// Enum?
	submission_time: string,
	club_id: number,
	data?: MrfData
}

export interface Mrf extends MrfData {
	_id: string,
	club_id: string,
	division_id: string,
	year: number,
	month: number,
	status: number,
	submissionTime: Date,
}

export interface MrfData {
	numDuesPaid: number,
	events: Cerf[],	// CERF IDs? OR straight data hmmm
	goals: string[],
	meetings: {date: string, attendance: { numMembers: number, numNonHomeMembers: number, numKiwanis: number, numGuests: number },
          		advisorAttended: {faculty: boolean, kiwanis: boolean}}[],
    boardMeetings: {date: string, attendance: { numBoard: number, numGuests: number}}[],

	dcm:{
		date: Date,
		presidentAttended: boolean,
		members: number,
		nextDcmDate: Date
	},

	communications:{
		ltg: string,
		dboard: string
	},
    fundraising: {source: string, ptp: number, kfh: number, fa: number, other: number, admin: number, fromEventReport: boolean}[],
	kfamReport: boolean,
}


/*
TODO:
-> localstorage persistant data when jumping between files (saving data locally shouldn't be too much of a risk)
	-> fetching from localdata and repeatedly fetching from database (requests, diff conflicts)?
-> expand form
	-> elastic "Member attendance" section
	-> look at example cerf
	-> tooltip help (question mark next to certain input fields)
-> make MRF support
-> excel integration (load/export)
-> navigation animation?


-> How much data to load? We could load it all (not that much data vs multiple requests), or just load basic info to display then when they click on a card, it calls on the endpoint
		{
			"id": 0,
			"date": "01-01-18",
			"dataURL": "https://some.rest.api.endpoint"
		},
  		
		{
			"id": 1,
			"date": "07-01-18",
			"data": { 
				"eventName": "",
				"author": "John",
				"membersAttended": null,
				"hours": 6
			}
		},

*/