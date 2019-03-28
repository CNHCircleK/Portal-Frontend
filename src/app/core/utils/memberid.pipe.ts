import { Pipe, PipeTransform } from '@angular/core';
import { MemberService } from '@core/services';

@Pipe({ name: 'memberID' })
export class MemberIDPipe implements PipeTransform {

	constructor(private memberService: MemberService) {};

	transform(value: string): string {
		return this.memberService.getNameFromId(value);
	}
}