import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { SignupService } from '../services/signup.service';

export function EMailValidator(signupService: SignupService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return signupService.checkEMailTaken(control.value);
    };
}

@Directive({
    selector: '[appEMailValidator][ngModel],[appEMailValidator][FormControl], [appEMailValidator][formControlName]',
    providers: [
        { provide: NG_ASYNC_VALIDATORS, useExisting: EMailValidatorDirective, multi: true }
    ]
})
export class EMailValidatorDirective implements AsyncValidator {

    constructor(private signupService: SignupService) { }

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return EMailValidator(this.signupService)(control);
    }
}
