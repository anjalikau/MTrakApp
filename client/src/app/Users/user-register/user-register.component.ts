import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { SysModule } from 'src/app/_models/sysModule';
import { User } from 'src/app/_models/user';
import { UserLevel } from 'src/app/_models/userLevel';
import { AccountService } from '_services/account.service';
import { RegisterService } from '_services/register.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {
  //@Input() usersFromHomeComponent: any;//get from parent
  //@Output() cancelRegister = new EventEmitter();// sent to parent
  sysModules: SysModule[];
  userLevel: UserLevel[];
  registerForm: FormGroup;
  userSaveButton: boolean = false;
  userReg: boolean = false;
  moduleReg: boolean = false;
  changePswd: boolean = false;
  showPassword = false;
  user: User;
  validationErrors: string[] = [];

  constructor(
    private registerService: RegisterService,
    private toastr: ToastrService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.getUserPermmision();
    this.LoadModules();
    this.LoadUserLevel();
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    console.log(this.showPassword);
    // this.registerForm.controls.password.value().type = this.showPassword ? 'text' : 'password';
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.registerForm = this.fb.group({
      cAgentName: ['', Validators.required],
      cPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('cPassword')],
      ],
      iCategoryLevel: ['', Validators.required],
      cDescription: [],
      cEmail: [],
    });
    this.registerForm.controls.cPassword.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  /// CHECK THE PASSWORD MATCH BY THE CONFIRM PASSWORD
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null
        : { isMatching: true };
    };
  }

  /// IG COMBO SELECT ONLY ONE VALUE
  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  getUserPermmision() {
    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 29).length > 0) {
        this.userReg = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 30).length > 0) {
        this.changePswd = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 46).length > 0) {
        this.moduleReg = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 89).length > 0) {
        this.userSaveButton = true;
      }
    }
  }

  register() {
    if (this.userSaveButton == true) {
      //this.registerForm.get('factoryId').setValue(this.registerForm.get('factoryId').value[0]);
      this.registerForm
        .get('iCategoryLevel')
        .setValue(this.registerForm.get('iCategoryLevel').value[0]);

      //console.log(this.registerForm.value);
      this.registerService.userRegister(this.registerForm.value).subscribe(
        () => {
          this.toastr.success('User Registered Successfully !!!');
          this.registerForm.reset();
          //console.log(response);
          //this.cancel();
        },
        (error) => {
          this.validationErrors = error;
          //console.log(error);
          //this.toastr.error(error.error);
        }
      );
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  //// LOADS SYSTEM MODULES
  LoadModules() {
    this.registerService.getSysModules().subscribe((modules) => {
      this.sysModules = modules;
    });
  }

  //// LOADS PERMITED USER LEVEL
  LoadUserLevel() {
    this.registerService.getUserLevel().subscribe((levels) => {
      this.userLevel = levels;
    });
  }

  /// CANCEL THE USER REGISTRATION
  cancelRegister() {
    this.registerForm.reset();
  }

  //// LOADS PERMITED USER LIST
}
