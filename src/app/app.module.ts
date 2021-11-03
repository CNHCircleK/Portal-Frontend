import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
    LoginComponent,
    SignupComponent,
	CerfComponent,
     
	MrfComponent,
    MrfListComponent,
    MyCerfsComponent,
    MrfsComponent,
    ClubAdministrationComponent,
    DialogNewMember,
    ClubsComponent,
    DialogNewClub,
	ProfileComponent,
    FAQsComponent,
    SettingsComponent,
    ConfirmDialogComponent,
    InfoDialog,
    TagsDialog,
    EqualValidator,
    DivisionsComponent } from '@app/modules/';

import { RouteReuseStrategy } from '@angular/router';
import { MrfReuseStrategy } from '@core/guards/reuse-strategy';
import { httpInterceptorProviders } from '@core/http-interceptors';
import { HttpClientModule } from '@angular/common/http';
import HttpConfig from '@env/api_config';
import { MemberIDPipe } from '@core/utils/memberid.pipe';
import { ClubIDPipe } from '@core/utils/clubid.pipe';
import { DivisionIDPipe } from '@core/utils/divisionid.pipe';
import { StorageModule } from '@ngx-pwa/local-storage';
// import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
// export function tokenGetter() {
//   return localStorage.getItem('access_token');
// }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    CerfComponent,
    MrfComponent,
    
    MrfListComponent,
    MyCerfsComponent,
    MrfsComponent,
    ClubAdministrationComponent,
    DialogNewMember,
    ClubsComponent,
    DialogNewClub,
    ProfileComponent,
    FAQsComponent,
    SettingsComponent,
    ConfirmDialogComponent,
    InfoDialog,
    TagsDialog,
    MemberIDPipe,
    ClubIDPipe,
    DivisionIDPipe,
    EqualValidator,
    DivisionsComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StorageModule.forRoot({ IDBNoWrap: false })
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     whitelistedDomains: [HttpConfig.schemelessUrl],
    //     blacklistedRoutes: []
    //   }
    // })
  ],
  providers: [httpInterceptorProviders],//, {provide: RouteReuseStrategy, useClass: MrfReuseStrategy}],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent, InfoDialog, TagsDialog, DialogNewMember, DialogNewClub]
})
export class AppModule {
}
