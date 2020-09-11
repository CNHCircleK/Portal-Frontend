/* 3rd party libraries */
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Our components */
import { CerfComponent, CerfListComponent, 
		MrfComponent, MrfListComponent,
    MyCerfsComponent,
		ProfileComponent,
    ClubAdministrationComponent,
    ConfirmDialogComponent } from '@app/modules/';
import { NewFocusInput } from '@core/utils/newfocusinput';

/* Our services */
// import { DataService } from '@core/data/data.service';
// import { MemberIDPipe } from '@core/utils/memberid.pipe';

/* Our modules */
import { MaterialsModule } from '@app/modules/';
import { AppRoutingModule } from '@app/modules/app-routing.module';
//import { invalidRangeValidator } from '@app/modules';

/* Other modules */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDatepickerModule, MatMomentDateModule } from '@coachcare/datepicker';
import { ColorPickerModule } from 'ngx-color-picker';




@NgModule({
  imports: [
    CommonModule,
    MaterialsModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    OverlayModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ColorPickerModule
  ],
  declarations: [
	 // MemberIDPipe
   NewFocusInput
  ],
  providers: [
    // DataService
  ],
  exports: [
    CommonModule,
    MaterialsModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    OverlayModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ColorPickerModule
  ]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor (
    @Optional() @SkipSelf() parentModule: CoreModule
    // private dataService: DataService 	// We want to instantiate our service so the data is loaded before it's routed to /cerf
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}