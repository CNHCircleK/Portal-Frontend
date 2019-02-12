import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of ,  zip ,  forkJoin } from 'rxjs';
import { defaultIfEmpty, concatMap, map, tap, filter, catchError, first, last } from 'rxjs/operators';
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
    mrfState: Mrf;
    mrfFormState;
    mrfTabState: string;

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
    author: "",
    time: {start: new Date(), end: new Date() },
    attendees: [],
    hoursPerAttendee: {service: 0, leadership: 0, fellowship: 0 },
    overrideHours: [],
    tags: [],
    fundraised: {
      amountRaised: 0,
      amountSpent: 0,
      usedFor: ""
    },
    status: 0,
    drivers: [],
    comments: {
      summary: "",
      strengths: "",
      weaknesses: "",
      improvements: ""
    },
    kfamAttendance: [],
    categories: []
  });

  logoutData() {
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


  getCerf(id: string) {
    return this.http.get<any>(HttpConfig.baseUrl + '/events/' + id);
  }
  getMyCerfList(): Observable<Cerf[]> {
    return this.http.get<any>(HttpConfig.baseUrl + '/members/' + this.user._id + '/events');
    // it is not the service's concern to clean up the data for the app to consume (e.g. reading 'success' or returning [])
  }
  getPendingCerfs() {
    return this.http.get<any>(HttpConfig.baseUrl + '/clubs/' + this.user.club_id + '/events/status/1');
    // This returns all. Endpoint to get it for specific month? Or we can filter and split up, but inefficient
  }

  updateCerf(data: Cerf) {
    if(data._id == "new") {
      return this.http.post(HttpConfig.baseUrl + "/events/new", data).pipe(tap(res => console.log(res)));;
      // this.getMyCerfList();

      // TODO: Special cache handler since the user will access this new cerf through its id
      // or leave it to refresh get requests again
    }
    return this.http.patch(HttpConfig.baseUrl + "/events/" + data._id, data).pipe(tap(res => console.log(res)));;
    // TODO: cache-bust according to data._id
  }
  
  changeCerfStatus(id: string, action: string) {
    if(action == "SUBMIT") {
      return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/submit", {submit: true}).pipe(tap(res => console.log(res)));
    } else if(action == "UNSUBMIT") {
      return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/submit", {submit: false}).pipe(tap(res => console.log(res)));
    } else if(action == "CONFIRM") {
      return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/confirm", {confirm: true}).pipe(tap(res => console.log(res)));
    } else if(action == "UNCONFIRM") {
      return this.http.patch(HttpConfig.baseUrl + "/events/" + id + "/confirm", {confirm: false}).pipe(tap(res => console.log(res)));
    }

    return of(null);
  }

  deleteCerf(id: string) {
    return this.http.delete(HttpConfig.baseUrl + "/events/" + id);
  }




  // just a simple array of month-year objects
  getMrfList(): Observable<Mrf[]> {
    const current = moment();
    const oldest = moment().month() > 5 ? moment().set('month', 5) : moment().subtract(1, 'year').set('month', 5);
    let list = [];
    while ((current > oldest || current.format('M') === oldest.format('M')) && list.length < 13) {
      list.push({ month: current.format('M'), year: current.format('YYYY') });
      current.subtract(1, 'month');
    }

    return of(list);
  }


  /*
  Result:
  {
    color: "",
    labels: [""],
    communications: {
      ltg: "",
      dboard: ""
    },
    dcm: {
      date: "",
      presidentAttended: bool,
      nextDate: "",
      numMembers: "" (specify HOME club members)
    },
    events: [],
    goals: [],
    kfamReport: bool,
    meetings: [{date, numMembers, numKiwanis, numNonHomeMembers,
      numGuests, advisorAttended: {faculty: bool, kiwanis: bool}}], (specify general/board meeting)
    month: int,
    year: int,
    status: int,
    submissionTime: "",
    updates: {
      duesPaid: bool,
      newDuesPaid: bool
    }
  }
  */
  getMrfByDate(year: number, month: number) {
    // mock data for UI implementation while backend data structure gets updated
    let mockMRF = { result: {
        communications: {
          ltg: "",
          dboard: ""
        },
        dcm: {
          date: "",
          presidentAttended: true,
          nextDate: "",
          numMembers: ""
        },
        events: [{id: "5b78ffcc14ac533fd9f9d556", date: new Date(), name: "Test Event", numAttendees: 2, totalService: 200, totalLeadership: 140, totalFellowship: 24, tags: ["co", "do"]}],
        goals: [],
        kfamReport: true,
        meetings: [{date: "1/28", numMembers: "", numKiwanis: "", numNonHomeMembers: "",
          numGuests: "", advisorAttended: {faculty: true, kiwanis: true}}],
        boardMeetings: [{date: "1/28", boardMembers: 0, guests: 0}],
        fundraising: [{source: "Go West", ptp: 0, kfh: 0, fa: 0, other: 0, admin: 0, fromEventReport: true}],
        month: 1,
        year: 2019,
        status: 0,
        submissionTime: "",
        updates: {
          dues_paid: 0
        }
      }
    }
    return of(mockMRF);


    // return this.http.get<any>(HttpConfig.baseUrl + '/clubs/' + this.user.club_id + '/mrfs/' + year + "/" + month)
    // .pipe(tap(response => console.log(response)));
  }

  updateMrf(data: Mrf) {
    return this.http.patch(HttpConfig.baseUrl + "/clubs/" + this.user.club_id + "/mrfs/" + data.year + "/" + data.month, data);
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



  fetchMembers() {
    return this.http.get<any>(HttpConfig.baseUrl + "/clubs/" + this.user.club_id + "/members");
  }

  addMember(first: string, last: string) {
    return this.http.post(HttpConfig.baseUrl + '/clubs/' + this.user.club_id + "/members/new", {'firstName': first, 'lastName': last});
  }

  getMemberCode(id: string) {
    return this.http.get<any>(HttpConfig.baseUrl + '/members/' + id + '/registration');
  }

  getClubs() {
    return this.http.get<any>(HttpConfig.baseUrl + "/divisions/" + this.user.division_id + "/clubs");
    // .pipe(
    //     map( (res: response) => {
    //       if(res.success)
    //         this.clubs = res.result;
    //       return this.clubs;
    //     }))
    // }
    // return of(this.clubs);
  }

  newClub(name: string) {
    console.log(name);
    return this.http.post(HttpConfig.baseUrl + '/divisions/' + this.user.division_id + '/clubs', {'name': name}).pipe(
      map( (res: response) => res.success));
  }

}