import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { tap, map, delay, catchError, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { RequestCache } from '@core/utils/request-cache.service';
import { AuthService } from '@core/authentication/auth.service';

@Injectable()    // provided in app.module
export class CacheInterceptor implements HttpInterceptor {
    
    constructor(private auth: AuthService, private cache: RequestCache) {
        cache.init(auth.getUserObservable());
    }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if(request.method != "GET")
        {
            this.cache.dirtyWrite(request);
            return next.handle(request);
        }
        const cachedResponse = this.cache.get(request);
        return cachedResponse ? of(cachedResponse) : this.sendRequest(request, next, this.cache);
    }

    private sendRequest(request: HttpRequest<any>, next: HttpHandler, cache: RequestCache): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(event => {
            // let log = {};
            // log["url"] = request.url.substring(61);
            // log["response"] = event.body;
            // console.log(JSON.stringify(log));
            if(event instanceof HttpResponse)
                cache.put(request, event);
        }));
    }
}

export let cacheInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: CacheInterceptor,
    multi: true
};