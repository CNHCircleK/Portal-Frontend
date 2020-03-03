export class Club {

	constructor(
		public _id: string,
		public name: string,
		public division_id: string,
		public administration?: ClubAdministration
	){}
}

export class ClubAdministration {

	constructor(
		public advisor: string,
		public goals: {
			service: {
				hours: {
					total: number,
					perMember: number
				},
				fundraising: {
					ptp: number,
					ka: number,
					kfh: number
				},
				other: string[]
			},
			leadership: {
				other: string[]
			},
			fellowship: {
				duesPaid: number,
				interclubs: number
			}
		}
	){}
}