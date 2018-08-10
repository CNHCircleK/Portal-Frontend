import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { defaultIfEmpty, map, tap, filter, catchError, first, last } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CerfData, Cerf } from './cerf';
import { MrfData, Mrf } from './mrf';
// import { CoreModule } from '@core/core.module';   CIRCULAR DEPENDENCY
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';
import { HttpConfig } from '@env/api_config.js';

@Injectable( { providedIn: 'root' } )
export class DataService {

  user: Member;
  cerfs: Cerf[]; nextCerfId: number;
  mrfs: Mrf[];
  // mockData: Mrf[] = [
  // {"_id": 1,"year": 2018,"month": 7,"status": 0,"submission_time": "2018-03-01T07:00:00Z","club_id":1},
  // {"_id": 2,"year": 2018,"month": 2,"status": 0,"submission_time": "2018-04-01T07:00:00Z","club_id":1},
  // {"_id": 3,"year": 2018,"month": 3,"status": 0,"submission_time": "2018-05-01T07:00:00Z","club_id":1},
  // {"_id": 4,"year": 2018,"month": 4,"status": 0,"submission_time": "2018-06-01T07:00:00Z","club_id":1},
  // {"_id": 5,"year": 2018,"month": 5,"status": 0,"submission_time": "2018-07-01T07:00:00Z","club_id":1},
  // {"_id": 6,"year": 2018,"month": 6,"status": 0,"submission_time": null,"club_id":1}
  // ];
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
        this.user = {id:-1, name:"undefined", club_id:-1,division_id:-1,access: {club:0,division:0,district:0}};
    });
  }

  resetData()
  {
    this.localStorage.clear().subscribe(()=>{});  // removes token also
  }

	// CREATE
  blankCerf = (): Cerf => ({  // a factory
        "_id":this.nextCerfId,"event_name":"New Event","date":new Date('2018-01-01T00:00:00'),"data": { cerf_author: "",
        chair_id: "", chair_name: "", event_contact: "", event_number: "",
        time: {start: new Date('2018-01-01T00:00:00'), end: new Date('2018-01-01T00:00:00') },
        location: "",
        hours_per_attendee: {service: 0, leadership: 0, fellowship: 0 },
        attendees: [],
        total_attendees: 0,
        tags: {service: "", leadership: "", fellowship: "", miscellaneous: "", },
        drivers: [],
        total_drivers: 0,
        total_mileageTo: 0,
        total_mileageFrom: 0,
        total_mileage: 0,
        funds_raised: 0,
        funds_spent: 0,
        funds_profit: 0,
        funds_usage: "",
        commentary: {summary: "", strengths: "", weaknesses: "", advice: ""},
        comments: [],
        history: [],
        status: 1
  }});

  newCerf(): Cerf {
    /*
    return this.http.get( HttpConfig.baseUrl + HttpsConfig.generateCerf );  // an observable
    */
    let blankCerf =  this.blankCerf();
    this.cerfs.push(blankCerf);
    this.nextCerfId++;
    return blankCerf;
  }

	// READ/GET
	getCerfList(refresh?: boolean): Observable<Cerf[]> {
    if(!Array.isArray(this.cerfs) || refresh)
    {
      // we haven't loaded or want to force refresh
      return this.localStorage.getItem('cerfList').pipe(filter(data => data !== null), defaultIfEmpty( <Cerf[]>[] ),
        tap(cerfs => { this.cerfs = cerfs;
          if(this.cerfs.length==0) this.nextCerfId=1;
          else this.nextCerfId = this.cerfs[this.cerfs.length-1]._id + 1}),
        tap(cerfs => console.log("List from storage ", cerfs)));
    }
    return of(this.cerfs);
  }

  getCerfById(id: number, refresh?: boolean): Observable<Cerf> {
    if(!this.cerfs) {    // tried to refresh the page or something
      console.error("Cerfs have not been loaded");
      return of(null);
    }
    let existing = this.cerfs.find(cerf => cerf._id==id);
    if(!existing){
      console.error("Cerf with id " + id + " does not exist");
      return of(null);
    }
    if(!refresh && existing.data)  // The cerf is loaded into the data
    {
      // we have it saved locally and don't want to refresh.
      return of(existing);
    } else {
      // Request cerf with id from server and save it locally to the service, and return the observable
      // ** We should also update the cerf list just in case?
      return this.localStorage.getItem<Cerf>('cerfs' + id).pipe(tap(response => existing = response), tap(res => console.log("Got Cerf " + id)));
    } 
  }

	// UPDATE
	updateCerf(data: Cerf) {
      let index = this.cerfs.findIndex(cerf => cerf._id == data._id); // can probably store index in the CERF cerfs for easy access
      if(index == -1) {
        console.error("Cerf with id " + data._id + " does not exist");
        return of(null);
      }
      this.cerfs[index] = data;
      this.localStorage.setItem('cerfList', this.cerfs).subscribe(()=>{});
      this.localStorage.setItem('cerfs' + data._id, data).subscribe(()=>{});
      
    }
    submitCerf(id: number) {
      let index = this.cerfs.findIndex(cerf => cerf._id == id);
      if(index == -1) {
        console.error("Cerf with id " + id + " does not exist");
        return;
      }
      // this.addCerfToMrf(this.cerfs[index], 1); // POST request
    }

  	// DELETE
  	deleteCerf(id: number) {
  		let ind = this.cerfs.findIndex(cerf => cerf._id == id);
  		this.cerfs.splice(ind, 1);
      this.localStorage.removeItem('cerfs' + id).subscribe(()=>{});
      this.localStorage.setItem('cerfList', this.cerfs).subscribe(()=>{});

    	// this.removeCerfAll(id);	// Propagate changes to MRFs. This will be done through MongoDB eventually
    }







    /* MRF handling */

  	// READ
  	getMrfList(refresh?: boolean): Observable<Mrf[]> {
  		if(!Array.isArray(this.mrfs) || refresh)
      {
        // we haven't loaded it or want to force refresh
        // return this.localStorage.getItem('mrfs').pipe(filter(data => data !== null), defaultIfEmpty( this.mockData ),
        //   tap(mrfs => this.mrfs = mrfs),
        //   tap(mrfs => console.log("MRFs from storage ", mrfs)));
        this.mrfs = this.mockData;
        return of(this.mockData);
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
    getMrfById(id: number): Observable<Mrf> {
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
  	// removeCerfAll(id: number) {	// Remove CERF from every MRF
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