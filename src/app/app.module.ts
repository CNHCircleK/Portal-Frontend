import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';


import { SidenavComponent,
    LoginComponent, SignupComponent,
		CerfComponent, CerfListComponent, 
		MrfComponent, MrfListComponent,
    MyCerfsComponent, MrfSecretaryComponent, MrfDivisionComponent, MrfDistrictComponent,
		ProfileComponent,
    ConfirmDialogComponent } from '@app/modules/';

import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
export function tokenGetter() {
  return localStorage.getItem('access_token');
}

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
    ProfileComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['192.168.1.22:3000'],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class AppModule {
}
