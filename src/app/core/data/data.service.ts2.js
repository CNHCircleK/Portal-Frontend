import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { defaultIfEmpty, tap, filter, map, catchError } from 'rxjs/operators';
import { zip } from 'rxjs';
import { CerfData, Cerf } from './cerf';
import { MrfData, Mrf } from './mrf';
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

  cerfs: Cerf[];
  mrfs: Mrf[];

  //** CERF helper methods **//
  getCerfList(refresh?: boolean): Observable<Cerf[]> {
    if(!Array.isArray(this.cerfData) || refresh)
    {
      // we haven't loaded or want to force refresh
      return this.localStorage.getItem('cerfList').pipe(filter(data => data !== null), defaultIfEmpty( <Cerf[]>[] ),
                                                        tap(cerfData => { this.cerfData = cerfData;
                                                         if(this.cerfData.length==0) this.nextCerfId=1;
                                                          else this.nextCerfId = this.cerfData[this.cerfData.length-1]._id + 1}),
                                                        tap(cerfData => console.log("List from storage ", cerfData)));
    }
    return of(this.cerfs);
  }

  getCerfById(id: number, refresh?: boolean): Observable<Cerf> {
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

    this.removeCerfAll(id); // Propagate changes to MRFs. This will be done through MongoDB eventually
  }
