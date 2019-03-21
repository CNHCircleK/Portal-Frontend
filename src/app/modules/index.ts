export * from './login/login.component';
export * from './signup/signup.component';
export { EqualValidator } from './signup/signup.component'; // ehhh
export * from './faqs/faqs.component';
export * from './settings/settings.component';

export * from './cerf/cerf.component';
export * from './mrf/mrf.component';
export * from './cerflist/cerflist.component';
export * from './mrflist/mrflist.component';

export * from './my-cerfs/my-cerfs.component';
export * from './mrf-secretary/mrf-secretary.component';
export * from './mrf-division/mrf-division.component';
export * from './mrf-district/mrf-district.component';

export * from './administration/administration.component';
export * from './clubs/clubs.component';
export * from './divisions/divisions.component';

export * from './profile/profile.component'; // make homepage instead, or dashboard/trends
export * from './confirm-dialog/confirm-dialog.component';
export * from './info-dialog/info-dialog';
export * from './cerf/tags-dialog.component';

export { MaterialsModule } from './materials.module';
// export { AppRoutingModule } from './app-routing.module'; // Circular dependency