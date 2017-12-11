import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {User} from '../../../models/user';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    user: User;

    constructor(private router: Router,
                private authenticationService: AuthenticationService) {
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigateByUrl('login');
    }

    ngOnInit() {
        this.user = this.authenticationService.getUser();
    }

}
