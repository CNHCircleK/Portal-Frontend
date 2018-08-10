import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { defaultIfEmpty, concatMap, map, tap, filter, catchError, first, last } from 'rxjs/operators';
import { zip } from 'rxjs';
import { forkJoin } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CerfData, Cerf } from './cerf';
import { MrfData, Mrf } from './mrf';
// import { CoreModule } from '@core/core.module';   CIRCULAR DEPENDENCY
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';
import HttpConfig from '@env/api_config';

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
    mrfs: Mrf[];

    mockData: Mrf[] = [
    {
      club_id: "1", year: 2018, month: 7, status: 0, submissionTime: new Date('2018-01-01T00:00:00'), updates: { duesPaid: true, newDuesPaid: false }, goals: [],
      meetings: [{ members: 5, nonHomeMembers: 0, kiwanis: 0, guests: 0, advisorAttendance:{ faculty: 0, kiwanis: 0 } }],
      dcm:{ date: new Date('2018-01-01T00:00:00'), presidentAttended: false, members: 0, nextDcmDate: new Date('2018-01-01T00:00:00') },
      feedback:{ ltg:{ message: "", contacted:{ visit: "", phone: "", email: "", newsletter: "", other: "" } }, dboard: "" },
      kfamReport:{ completed: false }
    },
    {
      club_id: "1", year: 2018, month: 6, status: 1, submissionTime: new Date('2018-01-01T00:00:00'), updates: { duesPaid: true, newDuesPaid: false }, goals: [],
      meetings: [{ members: 5, nonHomeMembers: 0, kiwanis: 0, guests: 0, advisorAttendance:{ faculty: 0, kiwanis: 0 } }],
      dcm:{ date: new Date('2018-01-01T00:00:00'), presidentAttended: false, members: 0, nextDcmDate: new Date('2018-01-01T00:00:00') },
      feedback:{ ltg:{ message: "", contacted:{ visit: "", phone: "", email: "", newsletter: "", other: "" } }, dboard: "" },
      kfamReport:{ completed: false }
    },
    {
      club_id: "1", year: 2018, month: 5, status: 1, submissionTime: new Date('2018-01-01T00:00:00'), updates: { duesPaid: true, newDuesPaid: false }, goals: [],
      meetings: [{ members: 5, nonHomeMembers: 0, kiwanis: 0, guests: 0, advisorAttendance:{ faculty: 0, kiwanis: 0 } }],
      dcm:{ date: new Date('2018-01-01T00:00:00'), presidentAttended: false, members: 0, nextDcmDate: new Date('2018-01-01T00:00:00') },
      feedback:{ ltg:{ message: "", contacted:{ visit: "", phone: "", email: "", newsletter: "", other: "" } }, dboard: "" },
      kfamReport:{ completed: false }
    }

    ];

    constructor(protected localStorage: LocalStorage, private auth: AuthService, private http: HttpClient) {
      this.auth.getUser().subscribe(user => {
        if(user)
          this.user = user;
        else
          this.user = {_id:"1", name:"undefined", club_id:"1",division_id:"1",access: {club:0,division:0,district:0}};
      });
    }

    resetData()
    {
    this.localStorage.clear().subscribe(()=>{});  // removes token also
  }

	// CREATE
  // blankCerf = (): Cerf => ({  // a factory
  //   "_id":"new","event_name":"New Event","date":new Date(),"data": { cerf_author: "",
  //   chair_id: "", chair_name: "", event_contact: "", event_number: "",
  //   time: {start: new Date(), end: new Date() },
  //   location: "",
  //   hours_per_attendee: {service: 0, leadership: 0, fellowship: 0 },
  //   attendees: [],
  //   total_attendees: 0,
  //   tags: {service: "", leadership: "", fellowship: "", miscellaneous: "", },
  //   drivers: [],
  //   total_drivers: 0,
  //   total_mileageTo: 0,
  //   total_mileageFrom: 0,
  //   total_mileage: 0,
  //   funds_raised: 0,
  //   funds_spent: 0,
  //   funds_profit: 0,
  //   funds_usage: "",
  //   commentary: {summary: "", strengths: "", weaknesses: "", advice: ""},
  //   comments: [],
  //   history: [],
  //   status: 1
  // }});
  blankCerf = (): Cerf => ({  // a factory
    "_id":"new","name":"New Event",chair_id:this.user._id,club_id:this.user.club_id,division_id:this.user.division_id,
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

  newCerf(): Observable<Cerf> {
    return of(this.blankCerf());
    // let newDate = new Date();
    // let endDate = new Date(); endDate.setDate(endDate.getDate() + 1);
    // let data = {
    //   name: "New",
    //   start: newDate,
    //   end: endDate.toISOString()
    // }
    // return this.http.post<Cerf>(HttpConfig.baseUrl + "/events/new", data).pipe(tap(res => { console.log(res); this.cerfs.push(res)}));
  }

	// READ/GET
	getCerfList(refresh?: boolean): Observable<Cerf[]> {
    if(!Array.isArray(this.cerfs) || refresh)
    {
      this.cerfs = [];
      let cerfRequests: Observable<Cerf>[] = [];
      return this.http.get(HttpConfig.baseUrl + "/clubs/" + this.user.club_id + "/mrfs/2018/08/events")
        .pipe(concatMap( (res: {"success": boolean, "auth": boolean, "result": {"_id": string, "status": number, "name": string}[]}) => {
                          for(let event of res.result)
                            cerfRequests.push(this.http.get<Cerf>(HttpConfig.baseUrl + "/events/" + event._id).pipe(tap(data => { console.log(data); this.cerfs.push(data)})));
                          return forkJoin(cerfRequests);
                        }
                      )
             )
    }
    return of(this.cerfs);
  }

  getCerfById(id: string, refresh?: boolean): Observable<Cerf> {
    if(this.cerfs===undefined) {    // tried to refresh the page or something
      console.error("Cerfs have not been loaded");
      return of(null);
    }
    let existing = this.cerfs.find(cerf => cerf._id==id);
    if(!existing){
      console.error("Cerf with id " + id + " does not exist");
      return of(null);
    } else {
      return this.http.get<Cerf>(HttpConfig.baseUrl + '/events/' + id).pipe(tap(res => console.log(res)));
    } 
  }

	// UPDATE
	updateCerf(data: Cerf): Observable<boolean> {
    if(data._id == "new")
      return this.createNewCerf(data);
    let index = this.cerfs.findIndex(cerf => cerf._id == data._id); // can probably store index in the CERF cerfs for easy access
    if(index == -1) {
      console.error("Cerf with id " + data._id + " does not exist");
      return of(false);
    } else {
      return this.http.post<any>(HttpConfig.baseUrl + "/events/" + data._id + "/edit", JSON.stringify(data)).pipe(tap(res=>console.log(res)),map( res => res.success));
    }
  }

  createNewCerf(data: Cerf): Observable<boolean> {
    const preData = data;
    preData['start'] = data.time.start;
    preData['end'] = data.time.end;

    console.log(JSON.stringify(preData))
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(HttpConfig.baseUrl + "/events/new", JSON.stringify(preData), {headers: headers}).pipe(tap(res=>console.log(res)),map(res => res.success)/*, tap(res => {
      data._id = res._id;
      this.cerfs.push(data);
    })*/);
  }

  submitCerf(id: string) {
    let index = this.cerfs.findIndex(cerf => cerf._id == id);
    if(index == -1) {
      console.error("Cerf with id " + id + " does not exist");
      return;
    }
  }

  	// DELETE
  	deleteCerf(id: string) {
  		let ind = this.cerfs.findIndex(cerf => cerf._id == id);
  		this.cerfs.splice(ind, 1);
    }







    /* MRF handling */

  	// READ
  	getMrfList(refresh?: boolean): Observable<Mrf[]> {
  		if(!Array.isArray(this.mrfs) || refresh)
      {

      }
      return of(this.mrfs);
    }
    getDivisionMrfs(refresh?: boolean): Observable<Mrf[]> {
      if(!Array.isArray(this.mrfs) || refresh)
      {
        // we haven't loaded it or want to force refresh

        return this.localStorage.getItem<Mrf[]>('mrfs'); 
        // return this.localStorage.getItem<Mrf[]>('mrfs').pipe(map( (data: Mrf[]) => data.concat(
        //   [
        //   {"_id": 11,"year": 2018,"month": 7,"status": 0,"submission_time": "2018-03-01T07:00:00Z","club_id":2},
        //   {"_id": 12,"year": 2018,"month": 6,"status": 0,"submission_time": "2018-04-01T07:00:00Z","club_id":2},
        //   {"_id": 13,"year": 2018,"month": 5,"status": 0,"submission_time": "2018-05-01T07:00:00Z","club_id":3},
        //   ]
        //   )));
      }
      return of(this.mrfs);
      // return of(this.mrfs).pipe(map( (data: Mrf[]) => data.concat(
      //     [
      //     {"_id": 11,"year": 2018,"month": 7,"status": 0,"submission_time": "2018-03-01T07:00:00Z","club_id":2},
      //     {"_id": 12,"year": 2018,"month": 6,"status": 0,"submission_time": "2018-04-01T07:00:00Z","club_id":2},
      //     {"_id": 13,"year": 2018,"month": 5,"status": 0,"submission_time": "2018-05-01T07:00:00Z","club_id":3},
      //     ]
      //     )));;
    }
    getMrfById(id: string): Observable<Mrf> {
      // if(!this.mrfs) {
      //   console.error("Mrfs have not been loaded");
      //   return of(null);
      // }
      // return of(this.mrfs.find(mrf => mrf._id == id));
      return of(this.mockData[id]);
    }

  	// UPDATE
  	// addCerfToMrf(cerf: Cerf, mrfId: number) {
  	// 	let ind = this.mrfs.findIndex(mrf => mrf._id == mrfId);
  	// 	if(ind != -1 && this.mrfs[ind].data) {
   //      let existing = this.mrfs[ind].data.events.find(event => event._id == cerf._id);
  	// 		if(existing)	// If it's not part of that MRF already
   //        existing = cerf;
   //      else
   //        this.mrfs[ind].data.events.push(cerf);
   //    } // else request the data from the server

   //  }
  	// removeCerfAll(id: string) {	// Remove CERF from every MRF
   //    if(!this.mrfs)
   //    {
   //      this.getCerfList().subscribe(mrfs => {
   //        this.removeCerfAll(id);  // wow recursion
   //      });
   //      return;
   //    }
  	// 	this.mrfs.forEach(mrf => {
  	// 		let ind = mrf.data.events.findIndex(event => event._id == id)
  	// 		if(ind != -1 && this.mrfs[ind].data)
  	// 			mrf.data.events.splice(ind, 1);
   //      // else request the data from the server
   //    });
  	// }
  	// removeCerf(cerfId: number, mrfId: number) {
   //    if(!this.mrfs)
   //    {
   //      this.getCerfList().subscribe(mrfs => {
   //        this.removeCerf(cerfId, mrfId);  // wow recursion
   //      });
   //      return;
   //    }
  	// 	let mrf: Mrf = this.mrfs.find(mrf => mrf._id == mrfId);
  	// 	if(mrf) {
  	// 		let ind = mrf.data.events.findIndex(event => event._id == cerfId)
  	// 		if(ind != -1 && this.mrfs[ind].data)
  	// 			mrf.data.events.splice(ind, 1);
   //      // else request the data from the server
   //    }
   //  }
   saveToClient() {
    	this.localStorage.setItem('mrfs', this.mrfs).subscribe(() => {});  // Only called when mrfnav component is loaded, for testing purposes
    }




    // getCerfsFromMrf(mrfId: number): Cerf[] {
    //   let mrf: Mrf = this.mrfs.find(mrf => mrf._id == mrfId);
    //   let cerfs: Cerf[] = [];
    //   if(mrf) {
    //     mrf.data.events.forEach(event => {
    //       this.getCerfById(event._id).subscribe(cerf => cerfs.push(cerf) );
    //     });
    //   }
    //   return cerfs;
    // }
  }