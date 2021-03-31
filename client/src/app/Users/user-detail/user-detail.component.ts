import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Factory } from 'src/app/_models/factory';
import { AccountService } from '_services/account.service';
import { RegisterService } from '_services/register.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Input() usersFromHomeComponent: any;//get from parent
  @Output() cancelRegister = new EventEmitter();// sent to parent
  model: any = {};
  factory : Factory[];
  
  constructor(private accountService: AccountService, 
    private registerService: RegisterService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.LoadFactories();
  }

  register() {
    this.accountService.userRegister(this.model).subscribe(response => {
      console.log(response);
      this.cancel();
    },error => {
      console.log(error);
      this.toastr.error(error.error);      
    })
  }

  LoadFactories() {
    this.registerService.getFactories().subscribe(factories => {
      this.factory = factories;
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
