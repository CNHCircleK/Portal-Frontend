import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Resolve, CanActivate } from '@angular/router';

import {
	CerfComponent,
	MyCerfsComponent,
	MrfComponent,
	MrfSecretaryComponent,
	MrfDivisionComponent,
	MrfDistrictComponent,
	MembersComponent,
	ProfileComponent,
	LoginComponent,
	FAQsComponent,
	SignupComponent } from '@app/modules/';

import { MembersResolver } from '@core/guards/members-resolver.guard';
import { MyCerfsResolver, CerfResolver, CerfNavResolver } from '@core/guards/cerf-resolver.guard';
import { MrfResolver, MrfSecretaryResolver, MrfDivisionResolver, MrfDistrictResolver } from '@core/guards/mrf-resolver.guard';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
	{ path: 'cerfs', component: MyCerfsComponent, resolve: { myCerfs: MyCerfsResolver }, canActivate: [AuthGuard] },
	{ path: 'cerf/:id', component: CerfComponent, resolve: { cerf: CerfResolver, mrfNav: CerfNavResolver }, canActivate: [AuthGuard] },
	{ path: 'mrfs', component: MrfSecretaryComponent, resolve: { secretaryMrfs: MrfSecretaryResolver }, canActivate: [AuthGuard] },
	{ path: 'mrf/:year/:month', component: MrfComponent, resolve: { mrf: MrfResolver }, canActivate: [AuthGuard] },
	{ path: 'divmrfs', component: MrfDivisionComponent, resolve: { divisionMrfs: MrfDivisionResolver }, canActivate: [AuthGuard] },
	{ path: 'distmrfs', component: MrfDistrictComponent, resolve: { districtMrfs: MrfDistrictResolver }, canActivate: [AuthGuard] },
	{ path: 'members', component: MembersComponent, resolve: { members: MembersResolver}, canActivate: [AuthGuard]},
	{ path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
	{ path: 'signup', component: SignupComponent },
	{ path: 'faqs', component: FAQsComponent },
	{ path: '', component: ProfileComponent, canActivate: [AuthGuard] } // DEFAULT ROUTE
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }