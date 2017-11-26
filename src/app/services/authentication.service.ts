import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient,
                private jwtHelperService: JwtHelperService) {
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
