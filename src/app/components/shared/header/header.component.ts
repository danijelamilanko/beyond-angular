import {Component, OnInit} from '@angular/core';
import {User} from '../../../models/user';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
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
