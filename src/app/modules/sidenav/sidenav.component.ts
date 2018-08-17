import {Component, Input} from '@angular/core'
// import {FormControl} from '@angular/forms'
import { Observable } from 'rxjs';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.css', './_sidenav.component.scss']
})

export class SidenavComponent {
	isExpanded=false;
	links = [
			{icon: 'person', text: 'Profile', route: '/', color: '#F2E18B'},
			{icon: 'assessment', text:'CERFs', route: '/cerfs', color: '#C7D6EE'},
			{icon: 'table_cell', text:'MRFs', route: '/mrfs', color: '#9EA374'},
			// {icon: 'library_books', text: 'Past MRFs'},
			{division: "Metro", text: 'Division MRFs', route: '/divmrfs'},
			{icon: 'library_books', text: 'District MRFs', route: '/distmrfs'},
			{icon: 'people', text: 'Members', route: '/members'}
		];
	userSubject: Observable<Member>;
	authLinks = [];

	// @Input() level: number = 1;

	constructor(private auth: AuthService) {
		this.userSubject = this.auth.getUser();
	 }

	ngOnInit() {
		this.refreshView();
	}

	refreshView() {
		this.userSubject.subscribe(user => {
			this.authLinks = [];
			if(user)
			{
				let access = user.access;
				this.authLinks.push(this.links[0]); // Profile
				this.authLinks.push(this.links[1]); // CERFs
				if(access.club > 0)
				{
					this.authLinks.push(this.links[2]); // MRF
					this.authLinks.push(this.links[5]);	// Members
				}
				if(access.division == 1)
				{
					// this.authLinks.push(this.links[3]); // Division MRFs
				}
				if(access.district == 1)
				{
					// this.authLinks.push(this.links[4]); // District MRFs
				}
			}
		});
	}
}