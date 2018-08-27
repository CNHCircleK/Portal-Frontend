import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Resolve, CanActivate } from '@angular/router';

import { CerfComponent, MyCerfsComponent,
		MrfComponent, MrfSecretaryComponent, MrfDivisionComponent, MrfDistrictComponent,
		MembersComponent,
		ProfileComponent, LoginComponent, SignupComponent } from '@app/modules/';
import { MembersResolver } from '@core/guards/members-resolver.guard';
import { MyCerfsResolver, CerfResolver, CerfNavResolver } from '@core/guards/cerf-resolver.guard';
import { MrfResolver, MrfSecretaryResolver, MrfDivisionResolver, MrfDistrictResolver } from '@core/guards/mrf-resolver.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { MrfDeactivateGuard } from '@core/guards/mrf-deactivate.guard';

const routes: Routes = [
	{ path: 'cerfs', component: MyCerfsComponent, resolve: { myCerfs: MyCerfsResolver }, canActivate: [AuthGuard] },
	{ path: 'cerf/:id', component: CerfComponent, resolve: { cerf: CerfResolver, mrfNav: CerfNavResolver }, canActivate: [AuthGuard] },
	{ path: 'mrfs', component: MrfSecretaryComponent, resolve: { secretaryMrfs: MrfSecretaryResolver }, canActivate: [AuthGuard] },
	{ path: 'mrf/:year/:month', component: MrfComponent, resolve: { mrf: MrfResolver }, canActivate: [AuthGuard], canDeactivate: [MrfDeactivateGuard] },
	{ path: 'divmrfs', component: MrfDivisionComponent, resolve: { divisionMrfs: MrfDivisionResolver }, canActivate: [AuthGuard] },
	{ path: 'distmrfs', component: MrfDistrictComponent, resolve: { districtMrfs: MrfDistrictResolver }, canActivate: [AuthGuard] },
	{ path: 'members', component: MembersComponent, resolve: { members: MembersResolver}, canActivate: [AuthGuard]},
	{ path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
	{ path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
	{ path: '', component: ProfileComponent, canActivate: [AuthGuard] } // DEFAULT ROUTE
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }