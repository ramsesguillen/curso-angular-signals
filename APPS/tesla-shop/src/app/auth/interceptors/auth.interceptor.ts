import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

import { AuthService } from "@auth/services/auth.service";
import { inject } from "@angular/core";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authToken = inject(AuthService).token();
    const newReq = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${authToken}`),
    });
    return next(newReq);
}
