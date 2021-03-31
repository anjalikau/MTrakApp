import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '_services/account.service';
import { RegisterService } from '_services/register.service';

@Component({
  selector: 'app-user-pwchange',
  templateUrl: './user-pwchange.component.html',
  styleUrls: ['./user-pwchange.component.css']
})
export class UserPwchangeComponent implements OnInit {
  pwChangeForm: FormGroup;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, private registerService: RegisterService
    ,private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initilizeForm();
  }

  initilizeForm() {
    this.pwChangeForm = this.fb.group ({
      cAgentName: ['', Validators.required],
      OldPassword: ['', Validators.required],
      cPassword: ['', [Validators.required , Validators.minLength(4), Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required , this.matchValues('cPassword')] ]   
    })
    this.pwChangeForm.controls.cPassword.valueChanges.subscribe(() => {
      this.pwChangeForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  /// CHECK THE PASSWORD MATCH BY THE CONFIRM PASSWORD
  matchValues(matchTo: string) : ValidatorFn {
    return(control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
      ? null : {isMatching: true}
    }
  }

  search() {
    console.log('ok');
  }


}
