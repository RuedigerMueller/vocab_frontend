import { HttpClient, HttpParams } from '@angular/common/http';
import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { backend, baseURL } from '../resource.identifiers';

export function EMailValidator(http: HttpClient): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        const params = new HttpParams().set('email', control.value);
        const obs = http.get<User>(`${baseURL}/${backend.users}`, { params })
            .pipe(
                map((user) => {
                    // null no error, object for error
                    return !user ? null : { eMailTaken: true };
                })
            );
        return obs;
    };
}

@Directive({
    selector: '[appEMailValidator][ngModel],[appEMailValidator][FormControl], [appEMailValidator][formControlName]',
    providers: [
        { provide: NG_ASYNC_VALIDATORS, useExisting: EMailValidatorDirective, multi: true }
    ]
})
export class EMailValidatorDirective implements AsyncValidator {

    constructor(private http: HttpClient) { }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return EMailValidator(this.http)(control);
    }
}
