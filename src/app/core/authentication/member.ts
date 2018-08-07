export interface Member {
  id: number,
  name: string,
  club_id: number,
  division_id: number,
  access?: {
    club: number,
    division: number,
    district: number
  }
}