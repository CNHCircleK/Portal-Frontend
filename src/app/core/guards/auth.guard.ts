import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Cerf } from '@core/data/cerf';
import { DataService } from '@core/data/data.service';

@Injectable( { providedIn: 'root' })
export class Can implements CanActivate {
	
}