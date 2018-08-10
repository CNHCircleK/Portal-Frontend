export interface Cerf2 {
	 _id: string,
	 event_name: string,
	 date: Date,
	 data?: CerfData
}

export interface CerfData {
	cerf_author?: string,	// not shown
	chair_id: string,		// not shown
	chair_name?: string,
	event_contact?: string,
	event_number?: string,
	time: {
		start: Date,	// dupe cerf.date?
		end: Date
	},
	location: string,
	hours_per_attendee: {
		service: number,
		leadership: number,
		fellowship: number
	},
	attendees: { name: string, service: number, leadership: number, fellowship: number, unpaid: boolean }[],//{ name: string, service: number, leadership: number, fellowship: number, paid: boolean }[],
	total_attendees?: number,	// not editable
	tags?: {
		service?: string,
		leadership?: string,
		fellowship?: string,
		miscellaneous?: string,
	},
	/*									
		CO	Community Service: An event where your club members are serving for the community without pay.
		CA	Campus Service: Any event where your club is doing community service on your school's campus.
		CS	Continuing Service: An event that has been completed with the same organization repeatedly at least once a month for a two-month duration.
		DSI	District Service Initiative: Any event that contributes to the current District Service Initiative.
		ISI	International Service Initiative: Any event that contributes to the current International Service Initiative.

		AD	Any event related to the operation of the club should be tagged as AD. Examples of administrative events include but are not limited to attending meetings (e.g. general meetings, board meetings, committee meetings, Kiwanis meetings), and workshops.

		SD/MD	Any event in which club members are socially interacting with one another should be tagged as SE. A social event promotes the moral of members so it is usually tagged as MD; however, remember that although all SE events are MD-tagged, not all MD events are SE-tagged (e.g. workshops).

		MD	Membership Development: An event that promotes membership recruitment and development.
		FR	Fundraiser: A home club-hosted event that raises money for a charity or for administrative funds.
		CK	Circle K: An event in which at least two members from your Circle K club and at least two members from another Circle K club are present.
		KF	Kiwanis Family: An event in which at least two members from your Circle K club and at least two members from another non-Circle K Kiwanis Family club are present.
		IN	Interclub: An event in which there must be a certain amount of members from your Circle K club and the same amount of members from another
			Circle K/Kiwanis Family club present, depending on your Circle K club's number of dues paid members. Clubs with less than or equal to
			20 members need a minimum of two members present; clubs with 21-30 members need a minimum of three memberrs present; and clubs with greater
			than or equal to 31 members need a minimum of four members present.
		WB	Webinar: An online webinar usualy hosted by the District Board for the District. This tag applies to both District and International webinars.
		DV	Divisional: An event hosted by and for the Division, which is usually hosted by the respective Lieutenant Governor (and Divisional Board).
		DE	District: An event hosted by and for the District.
		INT	International: An event hosted by Circle K International.
		HE	Club Hosted: Any event hosted through your Circle K club.
	*/
	drivers?: { name: string, mileageTo: number, mileageFrom: number }[],
	total_drivers?: number,	// not editable
	total_mileageTo?: number,	// not shown
	total_mileageFrom?: number,	// not shown
	total_mileage?: number,	// not editable

	funds_raised?: number,
	funds_spent?: number,
	funds_profit?: number,	// not editable
	funds_usage?: string,

	commentary?: {
		summary?: string,
		strengths?: string,
		weaknesses?: string,
		advice?: string
	},

	comments?: { field?: string, commenter?: string, comment?: string }[],

	history?: { changedAt?: Date, changedBy?: string, field?: string, value?: any }[],

	status: number	// Enums. not editable
}

export interface Cerf {
	_id: string,
	name: string,
	chair_id: string,
	club_id: string,
	division_id: string,
	time: {
		start: Date,
		end: Date
	}
	attendees: string[],
	hoursPerAttendee: {
		service: number,
		leadership: number,
		fellowship: number
	}
	overrideHours: number[]
	fundraised: {
		ptp: number,
		fa: number,
		kfh: number
	}
	tags: string[],
	status: number
}