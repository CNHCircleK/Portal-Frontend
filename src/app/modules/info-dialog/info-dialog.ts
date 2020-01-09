import { Component } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'info-dialog',
	templateUrl: 'info-dialog.html'
})
export class InfoDialog {
	
	title: string;
	htmlContent: SafeHtml;

	constructor(public dialogRef: MatDialogRef<InfoDialog>) {

	}

	// onNoClick(): void {
	// 	this.dialogRef.close();
	// }
}