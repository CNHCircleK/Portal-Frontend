import { NgModule } from '@angular/core';

import { MatFormFieldModule, MatIconModule, MatCardModule, MatGridListModule, MatInputModule,
			MatButtonModule, MatTooltipModule, MatSelectModule, MatTableModule,
			MatSortModule, MatPaginatorModule, MatDividerModule, MatDialogModule, MatCheckboxModule,
			MatProgressSpinnerModule, MatSidenavModule, MatListModule, MatToolbarModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
	imports: [
		MatFormFieldModule,
		MatIconModule,
		MatCardModule, 
		MatGridListModule,
		MatInputModule,
		MatButtonModule,
		MatTooltipModule,
		MatSelectModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatDividerModule,
		MatDialogModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSidenavModule,
		MatListModule,
		MatToolbarModule,
		MatSnackBarModule,
		BrowserAnimationsModule
	],
	exports: [
		MatFormFieldModule,
		MatIconModule,
		MatCardModule, 
		MatGridListModule,
		MatInputModule,
		MatButtonModule,
		MatTooltipModule,
		MatSelectModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatDividerModule,
		MatDialogModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSidenavModule,
		MatListModule,
		MatToolbarModule,
		MatSnackBarModule,
		BrowserAnimationsModule
	],
})

export class MaterialsModule { }