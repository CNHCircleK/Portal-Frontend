import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, delay, catchError, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()    // provided in app.module
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        // data

        return of(null).pipe(mergeMap(() => {

            // if (request.url.endsWith('/') && request.method === 'POST') {
            //     let body;

            //     return of(new HttpResponse({ status: 200, body: body}));
            //     return throwError({ error: { message: "" } });
            // }
            // if (request.url.endsWith('/') && request.method === 'POST') {
            //     let body;

            //     return of(new HttpResponse({ status: 200, body: body}));
            //     return throwError({ error: { message: "" } });
            // }
            // if (request.url.endsWith('/') && request.method === 'GET') {
            //     let body;

            //     return of(new HttpResponse({ status: 200, body: body}));
            //     return throwError({ error: { message: "" } });
            // }
            // if (request.url.endsWith('/') && request.method === 'POST') {
            //     let body;

            //     return of(new HttpResponse({ status: 200, body: body}));
            //     return throwError({ error: { message: "" } });
            // }
            // if (request.url.endsWith('/') && request.method === 'POST') {
            //     let body;

            //     return of(new HttpResponse({ status: 200, body: body}));
            //     return throwError({ error: { message: "" } });
            // }
            // if (request.url.endsWith('/') && request.method === 'POST') {
            //     let body;

            //     return of(new HttpResponse({ status: 200, body: body}));
            //     return throwError({ error: { message: "" } });
            // }
            // if (request.url.endsWith('/') && request.method === 'POST') {
            //     let body;

            //     return of(new HttpResponse({ status: 200, body: body}));
            //     return throwError({ error: { message: "" } });
            // }


            return next.handle(request)

        }))
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize())
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};