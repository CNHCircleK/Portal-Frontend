import { Directive, Renderer2, ElementRef } from '@angular/core';

@Directive({
	selector: "[newlyfocus]"
})
export class NewFocusInput {
	constructor(public renderer: Renderer2, public elementRef: ElementRef){}

	ngOnInit() {
		this.renderer.selectRootElement(this.elementRef.nativeElement).focus();
	}
}