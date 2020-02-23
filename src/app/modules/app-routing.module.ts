import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Resolve, CanActivate } from '@angular/router';

import {
	CerfComponent,
	MyCerfsComponent,
	MrfComponent,
	MrfsComponent,
	ClubAdministrationComponent,
	ClubsComponent,
	DivisionsComponent,
	ProfileComponent,
	LoginComponent,
	FAQsComponent,
	SettingsComponent,
	SignupComponent } from '@app/modules/';

import { MembersResolver } from '@core/guards/members-resolver.guard';
import { MyCerfsResolver, CerfNavResolver } from '@core/guards/cerf-resolver.guard';
import { MrfSecretaryResolver, MrfDivisionResolver, MrfDistrictResolver, MrfPendingCerfResolver } from '@core/guards/mrf-resolver.guard';
import { ClubsResolver } from '@core/guards/clubs-resolver.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { MrfDeactivateGuard } from '@core/guards/mrf-deactivate.guard';

const routes: Routes = [
	{ path: 'cerfs', component: MyCerfsComponent, resolve: { myCerfs: MyCerfsResolver, pendingCerfs: MrfPendingCerfResolver }, canActivate: [AuthGuard] },
	{ path: 'cerf/:id', component: CerfComponent, canActivate: [AuthGuard] },
	{ path: 'mrfs', component: MrfsComponent, resolve: { mrfs: MrfSecretaryResolver }, canActivate: [AuthGuard] },
	{ path: 'mrf/:year/:month', component: MrfComponent, canActivate: [AuthGuard], canDeactivate: [MrfDeactivateGuard] },
	{ path: 'club', component: ClubAdministrationComponent, resolve: { members: MembersResolver}, canActivate: [AuthGuard]},
	{ path: 'clubs', component: ClubsComponent, resolve: { clubs: ClubsResolver }, canActivate: [AuthGuard]},
	{ path: 'divisions', component: DivisionsComponent, canActivate: [AuthGuard]},
	{ path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
	{ path: 'signup', component: SignupComponent },
	{ path: 'faqs', component: FAQsComponent },
	{ path: 'settings', component: SettingsComponent },
	{ path: '', component: ProfileComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: ''} // DEFAULT ROUTE
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }