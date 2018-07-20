import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Resolve } from '@angular/router';

import { CerfListComponent, CerfComponent,
		MrfListComponent, MrfComponent,
		ProfileComponent } from '@app/modules/';
import { CerfnavResolver, CerfResolver } from '@core/guards/cerf-resolver.guard';
import { MrfnavResolver, MrfResolver } from '@core/guards/mrf-resolver.guard';

const routes: Routes = [
	{ path: 'cerfs', component: CerfListComponent, resolve: { CerfnavResolver } },
	{ path: 'cerf/:id', component: CerfComponent, resolve: { CerfResolver } },
	{ path: 'mrfs', component: MrfListComponent, resolve: { MrfnavResolver } },
	{ path: 'mrf/:id', component: MrfComponent, resolve: { MrfResolver } },
	{ path: '', component: ProfileComponent}	// DEFAULT ROUTE
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }