export interface Member {
  _id: string,
  name: string,
  club_id: string,
  division_id: string,
  access?: {
    club: number,
    division: number,
    district: number
  }
  code: string,
  email: string
}