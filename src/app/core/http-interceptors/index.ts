import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ContentTypeInterceptor } from './content-type-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { TokenInterceptor } from './token-interceptor';

export const httpInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true},
	{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
	{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
]