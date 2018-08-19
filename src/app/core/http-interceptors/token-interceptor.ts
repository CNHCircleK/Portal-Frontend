import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()	// provided in app.module
export class TokenInterceptor implements HttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    	// const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    	const token = localStorage.getItem('access_token');
    	if(token)
    		return next.handle(request.clone({
    			headers: new HttpHeaders({
    				'Authorization': 'Bearer ' + token 
    			})
    		}));
		return next.handle(request);
	}
}