import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    form: FormGroup;
    email: AbstractControl;
    password: AbstractControl;

    private submitted = false;
    private returnUrl: string;

    private loginSubscription: Subscription;

    constructor(private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private toastr: ToastrService) {
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });

        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
    }

    public onSubmit(values: Object): void {
        this.submitted = true;
        if (this.form.valid) {
            if (this.loginSubscription) {
                this.loginSubscription.unsubscribe();
            }
            this.loginSubscription = this.authenticationService.login(this.email.value, this.password.value)
                .subscribe(
                    data => {
                        if (data && data['token']) {
                            this.authenticationService.setData(data);
                            this.router.navigateByUrl(this.returnUrl);
                        } else {
                            this.toastr.error('There was a problem with login, please try again.', 'Error!');
                        }
                    },
                    error => {
                        this.toastr.error('There was a problem with login, please try again.', 'Error!');
                    });
        }
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngOnDestroy() {
        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
    }

}
