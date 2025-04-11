import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { Routes } from "@angular/router";

export const authRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'sign-up',
                component: RegisterPageComponent,
            },
            {
                path: '**',
                redirectTo: 'sign-up'
            }
        ]
    }
];

export default authRoutes;
