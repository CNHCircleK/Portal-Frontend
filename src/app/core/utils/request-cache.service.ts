import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Member } from '@core/authentication/member';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import HttpConfig from '@env/api_config';

const maxAge = 30000;
@Injectable( { providedIn: 'root' })
export class RequestCache  {

  cache = new Map();
  member: Observable<Member>;
  currentMember: Member;

  init(member: Observable<Member>)
  {
    this.member = member;
    this.member.pipe(first()).subscribe(member => this.currentMember = member);
  }

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    if(!this.member && this.member.pipe(first()).subscribe(member => this.currentMember._id == member._id))
    {
      this.cache.clear();  // If change accounts, we don't want anything cached
      return;
    }
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached || cached.lastRead < (Date.now() - maxAge)) {
      return undefined;
    }

    console.log("cached!",cached);
    return cached.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    if(response.status >= 400) {
      return;  // don't cache errors
    }

    const url = req.url;
    const entry = { url, response, lastRead: Date.now() };
    this.cache.set(url, entry);

    const expired = Date.now() - maxAge;
    this.cache.forEach(expiredEntry => {
      if (expiredEntry.lastRead < expired) {
        this.cache.delete(expiredEntry.url);
      }
    });
  }

  dirtyWrite(req: HttpRequest<any>) {  // don't cache post requests (in fact, remove cached reads that need to be re-read)
    if(this.cache.get(req.url))  // catch cerf/mrf/member/club patches
      this.cache.delete(req.url);

    // special handing for specific patches (e.g. submit/confirm)
    if(req.url.indexOf("/submit") > 0 || req.url.indexOf("/confirm") > 0) {
      const id = req.url.split("/").splice(-2, 1);  // ... events (-3) :id (-2) submit (-1) -- for cerfs
      this.cache.delete(HttpConfig.baseUrl + "/events/" + id + "/submit");  // delete() returns true if property does not exist
      this.cache.delete(HttpConfig.baseUrl + "/events/" + id + "/confirm");
      // this.cache.delete(HttpConfig.baseUrl + "/club/" + id + "/submit");
      // this.cache.delete(HttpConfig.baseUrl + "/club/" + id + "/submit");

      this.cache.delete(HttpConfig.baseUrl + "/members/" + this.member.pipe(first()).subscribe(member => member._id) + "/events");
    }

    // if(req.method == "PATCH") {
    //   if(req.url.indexOf("/events/")) {  // Remove cerf cache
    //     const cerfID = req.url.split("/").pop();

    //   }
    // }
  }
}