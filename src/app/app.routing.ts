import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {AuthGuard} from './guards/auth.guard';
import {LoginComponent} from './components/pages/login/login.component';
import {DashboardComponent} from './components/pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {path: '**', redirectTo: 'dashboard'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
