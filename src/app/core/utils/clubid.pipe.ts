import { Pipe, PipeTransform } from '@angular/core';
import { MemberService } from '@core/services';

@Pipe({ name: 'clubID' })
export class ClubIDPipe implements PipeTransform {

	constructor(private memberService: MemberService) {};

	transform(value: string): string {
		return this.memberService.mapIdToClub(value);
	}
}