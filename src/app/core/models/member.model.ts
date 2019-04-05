
export class Member {
  constructor(
    public _id: string,
    public name: string,
    public email: string,
    public clud_id: string,  // will these be in the roster
    public division_id: string,  //
    public access: { club: number, division?: number, district?: number },
    public code?: string
  ) {}
}