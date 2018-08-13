import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ContentTypeInterceptor } from './content-type-interceptor';

export const httpInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true}
]