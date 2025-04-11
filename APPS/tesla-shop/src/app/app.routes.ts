import { IsAdminGuard } from '@auth/guard/is-admin.guard';
import { NotAuthenticatedGuard } from '@auth/guard/not-authenticated.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
        canMatch: [NotAuthenticatedGuard]
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
        canMatch: [IsAdminGuard]
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes')
    },
];
