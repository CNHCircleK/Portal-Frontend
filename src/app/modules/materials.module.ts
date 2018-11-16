import { NgModule } from '@angular/core';

import { MatFormFieldModule, MatIconModule, MatCardModule, MatGridListModule, MatInputModule,
			MatButtonModule, MatTooltipModule, MatSelectModule, MatTableModule,
			MatSortModule, MatPaginatorModule, MatDividerModule, MatDialogModule, MatCheckboxModule,
			MatProgressSpinnerModule, MatSidenavModule, MatListModule, MatToolbarModule, MatSnackBarModule,
			MatExpansionModule } from '@angular/material';
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
		MatExpansionModule,
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
		MatExpansionModule,
		BrowserAnimationsModule
	],
})

export class MaterialsModule { }