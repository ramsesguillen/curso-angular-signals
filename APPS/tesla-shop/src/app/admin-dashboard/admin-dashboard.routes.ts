import { AdminDashboardLayoutComponent } from "./layouts/admin-dashboard-layout/admin-dashboard-layout.component";
import { ProductAdminPageComponent } from "./pages/product-admin-page/product-admin-page.component";
import { ProductsAdminPageComponent } from "./pages/products-admin-page/products-admin-page.component";
import { Routes } from "@angular/router";

export const adminDashboardRoutes: Routes = [
    {
        path: '',
        component: AdminDashboardLayoutComponent,
        children: [
            {
                path: 'products',
                component: ProductsAdminPageComponent
            },
            {
                path: 'products/:id',
                component: ProductAdminPageComponent
            },
            {
                path: '**',
                redirectTo: 'products'
            }
        ]
    }
];


export default adminDashboardRoutes;
