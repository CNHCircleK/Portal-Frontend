import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { defaultIfEmpty, concatMap, map, tap, filter, catchError, first, last } from 'rxjs/operators';
import { zip } from 'rxjs';
import { forkJoin } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

import { CerfData, Cerf } from './cerf';
import { MrfData, Mrf } from './mrf';
// import { CoreModule } from '@core/core.module';   CIRCULAR DEPENDENCY
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';
import HttpConfig from '@env/api_config';
import { MrfReuseStrategy } from '@core/guards/reuse-strategy';

type response = {
  success: boolean,
  auth: boolean,
  result: any    
}

@Injectable( { providedIn: 'root' } )
export class DataService {

  /** REST API
    GET (auth)
        /admin/divisions                - list divisions
        /divisions/divisionId/clubs     - list clubs in that division
    //    /divisions/divisionId/          - to list information about the division. There isnt much about it yet
    //    /clubs/clubId/                  - to list information about the club
        /clubs/clubId/members           - list members in that club
        /members/memberId/              - to get general info about that member
    //    /clubs/clubId/events            - to get recent events under a clubId
    POST (no auth)
        /signin                         - to sign in
    POST (auth)
        /signup                         - to signup
        /members/memberId/registration  - to get the registration code
        /clubs/clubId/members/new       - create new member (with POST request, "firstName" and "lastName" as fields)
        /events/new                     - for event creation
        /events/eventId/edit            - to edit
        **/

  /** IDs
  Divisions
    Golden Gate - 5b6d1fbfdf9a7b34033f945c

  Clubs
    Berkeley - 5b6d2054f176363426fe5b93
  
    **/

    user: Member;
    cerfs: Cerf[]; nextCerfId: number;
    clubCerfs: Cerf[];
    cerfsLoaded: boolean = false;
    clubCerfsLoaded: boolean = false;
    mrfs: Mrf[] = [];
    mrfState: Mrf;
    mrfFormState;
    mrfTabState: string;
    members: Member[];
    clubs: string[];

    // mockData: Mrf[] = [
    // {
    //   club_id: "1", year: 2018, month: 7, status: 0, submissionTime: new Date('2018-01-01T00:00:00'), updates: { duesPaid: true, newDuesPaid: false }, goals: [],
    //   events: [{_id:"5b6d34784db4fd1cb035a138", name: "new", time:{start: new Date(), end: new Date()}, status: 0}], meetings: [{ members: 5, nonHomeMembers: 0, kiwanis: 0, guests: 0, advisorAttendance:{ faculty: 0, kiwanis: 0 } }],
    //   dcm:{ date: new Date('2018-01-01T00:00:00'), presidentAttended: false, members: 0, nextDcmDate: new Date('2018-01-01T00:00:00') },
    //   feedback:{ ltg:{ message: "", contacted:{ visit: "", phone: "", email: "", newsletter: "", other: "" } }, dboard: "" },
    //   kfamReport:{ completed: false }
    // },
    // {
    //   club_id: "1", year: 2018, month: 6, status: 1, submissionTime: new Date('2018-01-01T00:00:00'), updates: { duesPaid: true, newDuesPaid: false }, goals: [],
    //   events: [], meetings: [{ members: 5, nonHomeMembers: 0, kiwanis: 0, guests: 0, advisorAttendance:{ faculty: 0, kiwanis: 0 } }],
    //   dcm:{ date: new Date('2018-01-01T00:00:00'), presidentAttended: false, members: 0, nextDcmDate: new Date('2018-01-01T00:00:00') },
    //   feedback:{ ltg:{ message: "", contacted:{ visit: "", phone: "", email: "", newsletter: "", other: "" } }, dboard: "" },
    //   kfamReport:{ completed: false }
    // },
    // {
    //   club_id: "1", year: 2018, month: 5, status: 1, submissionTime: new Date('2018-01-01T00:00:00'), updates: { duesPaid: true, newDuesPaid: false }, goals: [],
    //   events: [], meetings: [{ members: 5, nonHomeMembers: 0, kiwanis: 0, guests: 0, advisorAttendance:{ faculty: 0, kiwanis: 0 } }],
    //   dcm:{ date: new Date('2018-01-01T00:00:00'), presidentAttended: false, members: 0, nextDcmDate: new Date('2018-01-01T00:00:00') },
    //   feedback:{ ltg:{ message: "", contacted:{ visit: "", phone: "", email: "", newsletter: "", other: "" } }, dboard: "" },
    //   kfamReport:{ completed: false }
    // }

    // ];

    constructor(protected localStorage: LocalStorage, private auth: AuthService, private http: HttpClient) {
      this.auth.getUser().subscribe(user => this.user=user);
    }

    resetData()
    {
    this.localStorage.clear().subscribe(()=>{});  // removes token also
  }

  blankCerf = (): Cerf => ({  // a factory
    "_id":"new","name":"New Event",chair_id:this.user._id,author_id:this.user._id,club_id:this.user.club_id,division_id:this.user.division_id,
    time: {start: new Date(), end: new Date() },
    attendees: [],
    hoursPerAttendee: {service: 0, leadership: 0, fellowship: 0 },
    overrideHours: [],
    tags: [],
    fundraised: {
      ptp: 0,
      fa: 0,
      kfh: 0
    },
    status: 0
  });

  logoutData() {
    this.cerfs = null;
    this.clubCerfs = null;
    this.cerfsLoaded = false; this.clubCerfsLoaded = false;
    this.mrfs = [];
    this.auth.getUser().subscribe(user => this.user=user);
  }

  newCerf(): Cerf {
    return this.blankCerf();
    // let newDate = new Date();
    // let endDate = new Date(); endDate.setDate(endDate.getDate() + 1);
    // let data = {
    //   name: "New",
    //   start: newDate,
    //   end: endDate.toISOString()
    // }
    // return this.http.post<Cerf>(HttpConfig.baseUrl + "/events/new", data).pipe(tap((res: response) => { console.log(res); this.cerfs.push(res)}));
  }

	// READ/GET
	getMyCerfList(refresh?: boolean): Observable<Cerf[]> {
    if(!this.cerfsLoaded || refresh)
    {
      this.cerfsLoaded = true;
      return this.http.get<Cerf[]>(HttpConfig.baseUrl + '/members/' + this.user._id + '/events').pipe(
        map( (res: {success: boolean, auth: boolean, result: Cerf[]}) => {
          if(res.success) {
            return res.result;
          }
          return [];
        }),
        tap(res => {
          this.cerfs = res;
        }));
      // let cerfRequests: Observable<Cerf>[] = [];
      // return this.http.get(HttpConfig.baseUrl + "/clubs/" + this.user.club_id + "/mrfs/2018/08/events")
      //   .pipe(tap(res=>console.log(res)),concatMap( (res: {"success": boolean, "auth": boolean, "result": {"_id": string, "status": number, "name": string}[]}) => {
      //                     for(let event of res.result)
      //                       cerfRequests.push(this.http.get<Cerf>(HttpConfig.baseUrl + "/events/" + event._id).pipe(tap(data => { console.log(data); this.cerfs.push(data)})));
      //                     return forkJoin(cerfRequests);
      //                   }
      //                 )
      //        )
    }
    return of(this.cerfs);
  }

  getMrfPendingCerfs(month: number, year: number, refresh?: boolean): Observable<Cerf[]> {
    return this.http.get<Cerf[]>(HttpConfig.baseUrl + '/clubs/' + this.user.club_id + '/events/status/1').pipe(
      map( (res: response) => res.success ? (res.result as Cerf[]).filter(cerf => moment(cerf.time.start).month()==month-1 && moment(cerf.time.start).year()==year) : []));
  }

  // getClubCerfList(refresh?: boolean): Observable<Cerf[]> {
  //   if(!this.clubCerfsLoaded || refresh)
  //   {
  //     this.clubCerfsLoaded = true;
  //     return this.http.get<Cerf[]>(HttpConfig.baseUrl + '/clubs/' + this.user.club_id + '/events').pipe(
  //       tap((res: {result: Cerf[]}) => {
  //         this.clubCerfs = res.result;
  //       }));
  //   }
  //   return of(this.clubCerfs);
  // }

  getCerfById(id: string, refresh?: boolean): Observable<Cerf> {
    // if(!Array.isArray(this.cerfs)) { // refreshed or direct route access
    //   return this.getCerfList(true).pipe(map((res: response) => {
    //     if(res.success)
    //     {
    //       return this.getCerfById(id, true);
    //     }
    //   }));
    // }
    if(!this.isCerfLoaded(id) || refresh){
      return this.http.get<any>(HttpConfig.baseUrl + '/events/' + id).pipe(
        map( res => { 
          if(typeof(res.success) != "undefined" && res.success===false)
            return null;
          else
            return res;
        }),
        tap(res => {
          if(res)
            this.updateOrInsertCerfLocal(res);
        }));
    } else {
      return of(this.cerfs[this.findIndexOfCerf(id)]);
    }
  }

	// UPDATE
  private updateOrInsertCerfLocal(data: Cerf): void {
    if(!this.cerfs) {
      this.cerfs = [data];
    }
    const index = this.findIndexOfCerf(data._id);
    if(index==-1) {
      this.cerfs.push(data);
      return;
    }

    this.cerfs[index] = data;
  }
  updateCerf(data: Cerf): Observable<boolean> {
    if(data._id == "new")
      return this.createNewCerf(data);
    let index = this.findIndexOfCerf(data._id);
    if(index == -1) {
      console.log(this.cerfs);
      console.error("Cerf with id " + data._id + " does not exist");
      return of(false);
    } else {
      return this.http.patch(HttpConfig.baseUrl + "/events/" + data._id, data).pipe(tap(res => console.log(res)), map((res: response) => res.success));
    }
  }

  createNewCerf(data: Cerf): Observable<boolean> {
    return this.http.post<any>(HttpConfig.baseUrl + "/events/new", data).pipe(tap((res: response) => {
      if(res.result){
        this.updateOrInsertCerfLocal({...data, _id: res.result});
      }
    }), map((res: response) => res.success));
  }

  updateCerfToPending(id: string, doSubmit: boolean) {
    return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/submit", {submit: doSubmit}).pipe(
      map( (res: response) => res.success),
      tap( res => {
        if(res && this.isCerfLoaded(id))
          this.cerfs[this.findIndexOfCerf(id)].status = doSubmit ? 1 : 0; 
        
      }));
  }
  updateCerfToConfirm(id: string, doConfirm: boolean) {
    return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/confirm", {confirm: doConfirm}).pipe(
      tap( res => {if(res && this.isCerfLoaded(id)) this.cerfs[this.findIndexOfCerf(id)].status = doConfirm ? 2 : 1; }));
  }

	// DELETE
	deleteCerf(id: string) {
		if(!this.isCerfLoaded(id))
      return;
    return this.http.delete(HttpConfig.baseUrl + "/events/" + id).pipe(
      map( (res: response) => res.success ),
      tap( res => {
        if(res)
          this.cerfs.splice(this.findIndexOfCerf(id), 1);
      }));
  }

  private findIndexOfCerf(id: string): number {
    if(!this.cerfs) return -1;
    return this.cerfs.map(cerf => cerf._id).indexOf(id);
  }

  private isCerfLoaded(id: string): boolean {
    if(this.findIndexOfCerf(id) == -1) return false;
    return this.cerfs.find(cerf => cerf._id==id).chair_id != null;  // weak condition for checking if it's loaded...
  }


  /* MRF handling */

	// READ
	getMrfList(refresh?: boolean): Observable<Mrf[]> {
  		// if(!Array.isArray(this.mrfs) || refresh)
    //   {
    //     this.mrfs = this.mockData;
    //     return of(this.mrfs);
    //   }
    //   return of(this.mrfs);
    const current = moment();
    const oldest = moment().month() > 5 ? moment().set('month', 5) : moment().subtract(1, 'year').set('month', 5);
    let list = [];
    while ((current > oldest || current.format('M') === oldest.format('M')) && list.length < 13) {
      list.push({ month: current.format('M'), year: current.format('YYYY') });
      current.subtract(1, 'month');
    }

    return of(list);
  }
  getMrfByDate(year: number, month: number, refresh?: boolean): Observable<Mrf> {
    if(this.mrfState && this.mrfState.month == month && this.mrfState.year == year)
    {
      return of(this.mrfState);
    }
    if(!this.isMrfLoaded(year, month)) {
      return this.http.get(HttpConfig.baseUrl + '/clubs/' + this.user.club_id + '/mrfs/' + year + "/" + month).pipe(
        map( (res: response) => res.success ? res.result : null),
        tap (res => this.updateOrInsertMrfLocal(res)));
    }
    return of(this.mrfs[this.findIndexOfMrf(year, month)]);
  }

  private updateOrInsertMrfLocal(data: Mrf): void {
    if(!this.mrfs)
      return;
    const index = this.findIndexOfMrf(data.year, data.month);
    if(index==-1) {
      this.mrfs.push(data);
      return;
    }

    this.mrfs[index] = data;
  }

  updateMrf(data: Mrf): Observable<boolean> {
    let index = this.findIndexOfMrf(data.year, data.month);
    if(index == -1) {
      console.log("MRF with year " + data.year + " and month " + data.month + " not found");
      return of(false);
    } else {
      return this.http.patch(HttpConfig.baseUrl + "/clubs/" + this.user.club_id + "/mrfs/" + data.year + "/" + data.month, data).pipe(tap(res => console.log(res)), map((res: response) => res.success));
    }
  }

  private findIndexOfMrf(year: number, month: number): number {
    if(!this.mrfs) return -1;
    return this.mrfs.map(mrf => mrf.year.toString() + mrf.month).indexOf(year.toString() + month);
  }

  private isMrfLoaded(year: number, month: number): boolean {
    if(this.findIndexOfMrf(year, month) == -1) return false;
    return this.mrfs.find(mrf => mrf.year==year && mrf.month==month).goals != null;  // weak condition for checking if it's loaded...
  }

  routeThroughMrf: boolean = false;
  set routeMrf(throughMrf: boolean) {
    this.routeThroughMrf = throughMrf;
  }
  get isRouteMrf() {
    return this.routeThroughMrf;
  }

  setMrfState(component) {
    this.mrfState = component.mrfForm.getRawValue();
    this.mrfFormState = component.mrfForm;
    this.mrfTabState = component.currentTab;
  }

  deleteMrfState() {
    this.mrfState = undefined;
    this.mrfFormState = undefined;
    this.mrfTabState = undefined;
  }

  loadMrfState() {

  }

  get getMrfTabState() {
    if(this.mrfTabState) {
      return this.mrfTabState;
    }
    return "main";
  }

  get getMrfFormState() {
    if(this.mrfFormState)
      return this.mrfFormState;
  }


  getMembers(refresh?: boolean) {
    if(!Array.isArray(this.members) || refresh) {
      return this.http.get(HttpConfig.baseUrl + "/clubs/" + this.user.club_id + "/members").pipe(
        map( (res: response) => {
          if(res.success) {
            this.members = res.result.map(member => ({...member, name: member.name.first + ' ' + member.name.last}));
          }
          return this.members;
        })
        );
    }
    return of(this.members);
  }

  addMember(first: string, last: string) {
    return this.http.post(HttpConfig.baseUrl + '/clubs/' + this.user.club_id + "/members/new", {'firstName': first, 'lastName': last}).pipe(
      map( (res: response) => res.success));
  }

  getMemberCode(id: string) {
    return this.http.get(HttpConfig.baseUrl + '/members/' + id + '/registration').pipe(
      tap( (res: response) => {
        if(res.success)
          this.members[this.members.findIndex(member => member._id == id)]['code'] = res.result;
    }));
  }

  getClubs(refresh?: boolean): Observable<string[]> {
    if(!Array.isArray(this.clubs) || refresh) {
      return this.http.get(HttpConfig.baseUrl + "/divisions/" + this.user.division_id + "/clubs").pipe(
        map( (res: response) => {
          if(res.success)
            this.clubs = res.result;
          return this.clubs;
        }))
    }
    return of(this.clubs);
  }

  newClub(name: string) {
    console.log(name);
    return this.http.post(HttpConfig.baseUrl + '/divisions/' + this.user.division_id + '/clubs', {'name': name}).pipe(
      map( (res: response) => res.success));
  }

}