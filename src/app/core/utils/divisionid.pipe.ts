import { Pipe, PipeTransform } from '@angular/core';
import { MemberService } from '@core/data/member.service';

@Pipe({ name: 'divisionID' })
export class DivisionIDPipe implements PipeTransform {

	constructor(private memberService: MemberService) {};

	transform(value: string): string {
		return this.memberService.mapIdToDivision(value);
	}
}