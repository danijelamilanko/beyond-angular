import {Injectable} from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authenticationService: AuthenticationService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authenticationService.loggedIn()) {
            return true;
        } else {
            // not logged in so redirect to login page with the return url and return false
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }
    }
}
