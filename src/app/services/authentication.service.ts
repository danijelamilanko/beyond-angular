import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {User} from '../models/user';

@Injectable()
export class AuthenticationService {
    private user: User;

    constructor(private http: HttpClient,
                private jwtHelperService: JwtHelperService) {
    }

    getUser() {
        return this.user;
    }

    login(username: string, password: string) {
        const body = {
            'username': username,
            'password': password
        };
        return this.http.post(environment.apiUrl + 'authenticate', body);
    }

    logout() {
        localStorage.removeItem('token');
    }

    setData(data) {
        localStorage.setItem('token', data.token);
        this.user = {username: data.username};
    }

    loggedIn() {
        const token: string = this.jwtHelperService.tokenGetter();
        if (!token) {
            return false;
        }
        const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token);

        return !tokenExpired;
    }
}
