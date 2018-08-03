import { Cerf } from './cerf';

export interface Mrf {
	_id: number,
	year: number,
	month: number,
	status: 0,	// Enum?
	submission_time: string,
	club_id: number,
	data?: MrfData
}

export interface MrfData {
	events: Cerf[];
}

export interface Mrf2 {
	club_id: string,
	year: number,
	month: number,
	status: 0,
	submissionTime: null,
	updates: {
		duesPaid: null,
		newDuesPaid: null
	},
	goals: string[],
	meetings: [
		{
			members: null,
			nonHomeMembers: null,
			kiwanis: null,
			guests: null,
			advisorAttendance:{
				faculty: null,
				kiwanis: null
			}
		},

		{
			members: null,
			nonHomeMembers: null,
			kiwanis: null,
			guests: null,
			advisorAttendance:{
				faculty: null,
				kiwanis: null
			}
		},

		{
			members: null,
			nonHomeMembers: null,
			kiwanis: null,
			guests: null,
			advisorAttendance:{
				faculty: null,
				kiwanis: null
			}
		},

		{
			members: null,
			nonHomeMembers: null,
			kiwanis: null,
			guests: null,
			advisorAttended:{
				faculty: null,
				kiwanis: null
			}
		},

		{
			members: null,
			nonHomeMembers: null,
			kiwanis: null,
			guests: null,
			advisorAttendance:{
				faculty: null,
				kiwanis: null
			}
		}
	],

	dcm:{
		date: null,
		presidentAttended: null,
		members: null,
		nextDcmDate: null
	},

	feedback:{
		ltg:{
			message: null,
			contacted:{
				visit: null,
				phone: null,
				email: null,
				newsletter: null,
				other: null
			}
		},
		dboard: null
	},

	kfamReport:{
		completed: null
	}
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