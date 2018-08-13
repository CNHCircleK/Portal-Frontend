import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()	// provided in app.module
export class ContentTypeInterceptor implements HttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    	// const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    	request.headers.append('Content-Type', 'application/json; charset=utf-8');
		return next.handle(request);
	}
}