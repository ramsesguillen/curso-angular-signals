import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { inject } from '@angular/core';

export const IsAdminGuard: CanMatchFn = async (
    route: Route,
    segments: UrlSegment[]
) => {
    const authService = inject(AuthService);

    await firstValueFrom(authService.checkStatus());
    return authService.isAdmin();
}
