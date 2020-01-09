import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'tags-dialog',
	templateUrl: 'tags-dialog.component.html'
})
export class TagsDialog {

	constructor(public dialogRef: MatDialogRef<TagsDialog>) {

	}

	// onNoClick(): void {
	// 	this.dialogRef.close();
	// }
}