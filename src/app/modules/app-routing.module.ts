import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Resolve, CanActivate } from '@angular/router';

import { CerfListComponent, CerfComponent,
		MrfListComponent, MrfComponent,
		ProfileComponent } from '@app/modules/';
import { CerfnavResolver, CerfResolver } from '@core/guards/cerf-resolver.guard';
import { MrfnavResolver, MrfResolver } from '@core/guards/mrf-resolver.guard';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
	{ path: 'cerfs', component: CerfListComponent, resolve: { CerfnavResolver }, canActivate: [AuthGuard]  },
	{ path: 'cerf/:id', component: CerfComponent, resolve: { CerfResolver }, canActivate: [AuthGuard] },
	{ path: 'mrfs', component: MrfListComponent, resolve: { MrfnavResolver }, canActivate: [AuthGuard] },
	{ path: 'mrf/:id', component: MrfComponent, resolve: { MrfResolver }, canActivate: [AuthGuard]  },
	{ path: '', component: ProfileComponent}	// DEFAULT ROUTE
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }