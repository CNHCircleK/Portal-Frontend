import { NgModule } from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
		MatAutocompleteModule
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
		MatAutocompleteModule
	],
})

export class MaterialsModule { }