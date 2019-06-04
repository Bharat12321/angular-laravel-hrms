import { ErrorHandler ,  Injectable, Injector } from '@angular/core'

import { ToastrService } from 'ngx-toastr';
@Injectable()
export class AppErrorHandler extends ErrorHandler {
	constructor(private injector: Injector) { super(); }
	handleError(error: any): void {

		/*let toastr = this.injector.get(ToastrService);
		toastr.error(error.originalError.error.message, 'Error');*/
		console.log(error);
	}
}
