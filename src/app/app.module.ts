import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {ToastrModule} from 'ngx-toastr';
import {DashboardComponent} from './components/pages/dashboard/dashboard.component';
import {LoginComponent} from './components/pages/login/login.component';
import {AuthenticationService} from './services/authentication.service';
import {routing} from './app.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuard} from './guards/auth.guard';
import {AppTranslationModule} from './app.translation.module';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JwtModule} from '@auth0/angular-jwt';
import {environment} from '../environments/environment';
import {HeaderComponent} from './components/shared/header/header.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        LoginComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        AppTranslationModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: () => {
                    return localStorage.getItem('token');
                },
                whitelistedDomains: [environment.apiUrl]
            }
        }),
        ToastrModule.forRoot({
            maxOpened: 1,
            autoDismiss: true,
            newestOnTop: true,
            preventDuplicates: true
        }),
        routing
    ],
    providers: [
        AuthGuard,
        AuthenticationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
