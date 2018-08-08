import { NgModule } from '@angular/core';

import { MatFormFieldModule, MatIconModule, MatCardModule, MatGridListModule, MatInputModule,
			MatButtonModule, MatTooltipModule, MatSelectModule, MatTableModule,
			MatSortModule, MatPaginatorModule, MatDividerModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
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
		BrowserAnimationsModule
	]
})

export class MaterialsModule { }