import { Component, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { AuthService } from '@core/authentication/auth.service';
import { Member } from '@core/authentication/member';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: []
})
export class AppComponent {
  title = 'app';
	isLightTheme: boolean = true;
	// isExpanded=false;
	links = [
	{icon: 'home', text: 'Dashboard', route: '/', color: '#F2E18B'},
	{icon: 'assessment', text:'Event Reports', route: '/cerfs', color: '#C7D6EE'},
	{icon: 'table_cell', text:'Monthly Reports', route: '/mrfs', color: '#9EA374'},
	// {icon: 'library_books', text: 'Past MRFs'},
	{division: "Metro", text: 'Division MRFs', route: '/divmrfs'},
	{icon: 'library_books', text: 'District MRFs', route: '/distmrfs'},
	{icon: 'people', text: 'Administration', route: '/club'},
	{icon: 'assignment', text: 'Master Records', route: '/clubs'}
	];
	userSubject: Observable<Member>;
	authLinks = [];

	// @Input() level: number = 1;

	constructor(private auth: AuthService, private overlay: OverlayContainer) {
		this.userSubject = this.auth.getUser();
		this.overlay.getContainerElement().classList.add('light-theme');
	}

	ngOnInit() {
		this.refreshView();
	}

	toggleTheme() {
		this.isLightTheme = !this.isLightTheme;
		if (this.overlay.getContainerElement().classList.contains("light-theme")) {
			this.overlay.getContainerElement().classList.remove("light-theme");
			this.overlay.getContainerElement().classList.add("dark-theme");
		} else if (this.overlay.getContainerElement().classList.contains("dark-theme")) {
			this.overlay.getContainerElement().classList.remove("dark-theme");
			this.overlay.getContainerElement().classList.add("light-theme");
		} else {
			this.overlay.getContainerElement().classList.add("light-theme");
		}
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
					// this.authLinks.push(this.links[5]);	// Administration
				}
				if(access.division == 1)
				{
					this.authLinks.push(this.links[6]);	// Clubs
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