import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()	// provided in app.module
export class ErrorInterceptor implements HttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
		return next.handle(request).pipe(map(event => {
			if(event instanceof HttpResponse) {
				if(event.body.success == false || event.body.success == false)
					console.log(event.body);
			}
		return event;
		}),
		catchError(err => { console.log(err); return throwError(err); } ));
	}
}