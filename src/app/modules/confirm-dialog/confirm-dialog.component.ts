import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: 'confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.css']
})

export class ConfirmDialogComponent {

	public confirmMessage: string;
	constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }


}