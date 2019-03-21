export interface Cerf extends Partial<CerfData> {
	_id: string,
	name: string,
	status: number,
	time: {
		start: Date,
		end: Date
	},
	// author
}

export interface CerfData {
	readonly club_id: string,
	readonly division_id: string,
	author: { _id: string, name: { first: string, last: string } },
	chair: { _id: string, name: { first: string, last: string } },
	location: string,
	contact: string,
	tags: string[],
	attendees: { _id?: string, name: ({ first: string, last: string } | string), service?: number, leadership?: number, fellowship?: number }[],
	hoursPerAttendee: {
		service: number,
		leadership: number,
		fellowship: number
	}
	overrideHours: {
		attendee_id: string,
		service: number,
		leadership: number,
		fellowship: number
	}[]
	fundraised: {
		amountRaised: number,
		amountSpent: number,
		usedFor: string
	}
	drivers: {
		driver: string,
		milesFrom: number,
		milesTo: number
	}[]
	comments: {
		summary: string,
		strengths: string,
		weaknesses: string,
		improvements: string
	},
	kfamAttendance: {
		org: string,
		numAttendees: number
	}[]
	categories: string[],
}