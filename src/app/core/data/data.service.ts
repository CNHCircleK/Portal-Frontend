import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { defaultIfEmpty, tap, filter, catchError, first, last } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { CerfData, Cerf } from './cerf';
import { Mrf } from './mrf';
import { LocalStorage } from '@ngx-pwa/local-storage';
// import { CoreModule } from '@core/core.module';   CIRCULAR DEPENDENCY
// import { MrfDataService } from './mrf-data.service';
import { Member, AuthService } from '@core/authentication/auth.service';

@Injectable( { providedIn: 'root' } )
export class DataService {

  user: Member;

  constructor(protected localStorage: LocalStorage, private auth: AuthService) {
    this.auth.getUser().subscribe(user => {
      if(user)
        this.user = user;
      else
        this.user = {id:-1, name:"undefined", club_id:-1,division_id:-1,access: {club:0,division:0,district:0}};
    });
  }

  mockData: Mrf[] = [
  {"_id": 1,"year": 2018,"month": 7,"status": 0,"events": [],"submission_time": "2018-03-01T07:00:00Z"},
  {"_id": 2,"year": 2018,"month": 2,"status": 0,"events": [],"submission_time": "2018-04-01T07:00:00Z"},
  {"_id": 3,"year": 2018,"month": 3,"status": 0,"events": [],"submission_time": "2018-05-01T07:00:00Z"},
  {"_id": 4,"year": 2018,"month": 4,"status": 0,"events": [],"submission_time": "2018-06-01T07:00:00Z"},
  {"_id": 5,"year": 2018,"month": 5,"status": 0,"events": [],"submission_time": "2018-07-01T07:00:00Z"},
  {"_id": 6,"year": 2018,"month": 6,"status": 0,"events": [],"submission_time": null}
  ];

  /** Load at least IDs of all CERFs and MRFs to avoid potential read errors **/
  loadLists = forkJoin(
    this.localStorage.getItem('cerfList').pipe(filter(data => data !== null), defaultIfEmpty( <Cerf[]>[] ),
      tap(cerfData => { this.cerfData = cerfData;
        if(this.cerfData.length==0) this.nextCerfId=1;
        else this.nextCerfId = this.cerfData[this.cerfData.length-1]._id + 1}),
      tap(cerfData => console.log("CERFs from storage ", cerfData))),
    this.localStorage.getItem('mrfs').pipe(filter(data => data !== null), defaultIfEmpty( this.mockData ),
      tap(mrfData => this.mrfData = mrfData),
      tap(mrfData => console.log("MRFs from storage ", mrfData)))
    ).pipe(catchError(error=>of(error)));

  /* CERF handling */
  cerfData: Cerf[];
  // cerfMap: Map<CerfListItem, Cerf> = new Map(); I don't want to handle 2 sets of data, especially when one is a subset of another
  nextCerfId: number;

	// CREATE
  blankCerf = (): Cerf => ({  // a factory
    "_id":this.nextCerfId,"name":"New Event","date":"01/01/2018","data": { "chair_id" : this.user.id.toString(),"time" : {"start" : "2018-00-00T00Z:00:00Z","end" : ""},
    "location" : "","attendees" : [ ],"hours_per_attendee" : {"service" : 0,"leadership" : 0,"fellowship" : 0},
    "override_hours" : [ ],"tags" : [ ],"fundraised" : 0,"status" : 1} 
  });
  newCerf(): number {
    let blankCerf =  this.blankCerf();
    this.cerfData.push(blankCerf);
    this.nextCerfId++;
    return blankCerf._id;
  }

	// READ/GET
	getCerfList(refresh?: boolean): Observable<Cerf[]> {
    if(!Array.isArray(this.cerfData) || refresh)
    {
      // we haven't loaded or want to force refresh
      return this.loadLists.pipe(first());  // loadLists returns a sequence of observables, CERFs then MRFs
    }
      // return this.localStorage.getItem('cerfList').pipe(filter(data => data !== null), defaultIfEmpty( <Cerf[]>[] ),
      //                                                   tap(cerfData => { this.cerfData = cerfData;
      //                                                    if(this.cerfData.length==0) this.nextCerfId=1;
      //                                                     else this.nextCerfId = this.cerfData[this.cerfData.length-1]._id + 1}),
      //                                                   tap(cerfData => console.log("List from storage ", cerfData)));
      return of(this.cerfData);
    }

    getCerf(id: number, refresh?: boolean): Observable<Cerf> {
    if(!this.cerfData) {    // tried to refresh the page or something
      console.error("Cerfs have not been loaded");
      return of(null);
    }
    let existing = this.cerfData.find(cerf => cerf._id==id);
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
      let existing = this.cerfData.find(cerf => cerf._id == data._id); // can probably store index in the CERF cerfData for easy access
      if(!existing) {
        console.error("Cerf with id " + data._id + " does not exist");
        return of(null);
      }
      existing = data;
      this.localStorage.setItem('cerfs' + data._id, data).subscribe(()=>{});
      this.localStorage.setItem('cerfList', this.cerfData).subscribe(()=>{});
    }
    submitCerf(id: number) {
      let existing = this.cerfData.find(cerf => cerf._id == id);
      if(!existing) {
        console.error("Cerf with id " + id + " does not exist");
        return of(null);
      }
      this.addCerfToMrf(id, 1);
    }

  	// DELETE
  	deleteCerf(id: number) {
  		let ind = this.cerfData.findIndex(cerf => cerf._id == id);
  		this.cerfData.splice(ind, 1);
      this.localStorage.removeItem('cerfs' + id).subscribe(()=>{});
      this.localStorage.setItem('cerfList', this.cerfData).subscribe(()=>{});

    	this.removeCerfAll(id);	// Propagate changes to MRFs. This will be done through MongoDB eventually
    }







    /* MRF handling */
    mrfData: Mrf[];

  	// CREATE
  		// A new CERF will be provided by the database when ready

  	// READ
  	getMrfs(refresh?: boolean): Observable<Mrf[]> {
  		if(!Array.isArray(this.mrfData) || refresh)
      {
        // we haven't loaded it or want to force refresh
        return this.loadLists.pipe(last());  // loadLists returns a sequence of observables, CERFs then MRFs
      }
        // return this.localStorage.getItem('mrfs').pipe(filter(data => data !== null), defaultIfEmpty( this.mockData ),
        //                                                 tap(mrfData => this.mrfData = mrfData),
        //                                                 tap(mrfData => console.log("MRFs from storage ", mrfData)));
        return of(this.mrfData);
      }
      getMrf(id: number): Observable<Mrf> {
        if(!this.mrfData) {
          console.error("Mrfs have not been loaded");
          return of(null);
        }
        return of(this.mrfData.find(mrf => mrf._id == id));
      }

  	// UPDATE
  	addCerfToMrf(cerfId: number, mrfId: number) {
  		let ind = this.mrfData.findIndex(mrf => mrf._id == mrfId);
  		if(ind != -1) {
  			if(!this.mrfData[ind].events.find(event_id => event_id == cerfId))	// If it's not part of that MRF already
          this.mrfData[ind].events.push(cerfId);
      }

    }
  	removeCerfAll(id: number) {	// Remove CERF from every MRF
  		this.mrfData.forEach(mrf => {
  			let ind = mrf.events.findIndex(event_id => event_id == id)
  			if(ind != -1)
  				mrf.events.splice(ind, 1);
  		});
  	}
  	removeCerf(cerfId: number, mrfId: number) {
  		let mrf: Mrf = this.mrfData.find(mrf => mrf._id == mrfId);
  		if(mrf) {
  			let ind = mrf.events.findIndex(event_id => event_id == cerfId)
  			if(ind != -1)
  				mrf.events.splice(ind, 1);
  		}
  	}
  	saveToClient() {
    	this.localStorage.setItem('mrfs', this.mrfData).subscribe(() => {});  // Only called when mrfnav component is loaded, for testing purposes
    }





    getCerfsFromMrf(mrfId: number) {
      let mrf: Mrf = this.mrfData.find(mrf => mrf._id == mrfId);
      let cerfs: Cerf[] = [];
      if(mrf) {
        mrf.events.forEach(id => {
          this.getCerf(id).subscribe(cerf => { if(cerf) cerfs.push(cerf) });
        });
      }
      return cerfs;
    }
  }