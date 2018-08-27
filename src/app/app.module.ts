import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';


import { SidenavComponent,
    LoginComponent, SignupComponent,
		CerfComponent, CerfListComponent, 
		MrfComponent, MrfListComponent,
    MyCerfsComponent, MrfSecretaryComponent, MrfDivisionComponent, MrfDistrictComponent,
    MembersComponent, DialogNewMember,
		ProfileComponent,
    ConfirmDialogComponent } from '@app/modules/';

import { RouteReuseStrategy } from '@angular/router';
import { MrfReuseStrategy } from '@core/guards/reuse-strategy';
import { httpInterceptorProviders } from '@core/http-interceptors';
import { HttpClientModule } from '@angular/common/http';
import HttpConfig from '@env/api_config';
// import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
// export function tokenGetter() {
//   return localStorage.getItem('access_token');
// }

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    LoginComponent,
    SignupComponent,
    CerfComponent,
    MrfComponent,
    CerfListComponent,
    MrfListComponent,
    MyCerfsComponent,
    MrfSecretaryComponent,
    MrfDivisionComponent,
    MrfDistrictComponent,
    MembersComponent,
    DialogNewMember,
    ProfileComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule
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
  entryComponents: [ConfirmDialogComponent, DialogNewMember]
})
export class AppModule {
}
