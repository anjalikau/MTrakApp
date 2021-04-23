import { Component, OnInit } from '@angular/core';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-mainsidebar',
  templateUrl: './mainsidebar.component.html',
  styleUrls: ['./mainsidebar.component.css']
})
export class MainsidebarComponent implements OnInit {
  name = 'Angular 6';
  tab : any = 'tab1';
  tab1 : any
  tab2 : any
  tab3 : any
  Clicked : boolean

  constructor(public accountServices: AccountService) { }

  ngOnInit(): void {
    //console.log(this.accountServices.currentUser$);
  }

  
  onClick(check){
    //    console.log(check);
        if(check==1){
          this.tab = 'tab1';
        }else if(check==2){
          this.tab = 'tab2';
        }else{
          this.tab = 'tab3';
        }    
      
    }


}
