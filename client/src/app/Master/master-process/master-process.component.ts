import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { Size } from 'src/app/_models/size';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { Process } from 'src/app/_models/process';

@Component({
  selector: 'app-master-process',
  templateUrl: './master-process.component.html',
  styleUrls: ['./master-process.component.css']
})
export class MasterProcessComponent implements OnInit {
  mstrProcess: FormGroup;
  sizeProcessList: Process[];
  sizeList: Size[];
  user: User;
  saveobj: Process;
  saveButton: boolean = false;
  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  @ViewChild("sizeGrid", { static: true }) 
  public sizeGrid: IgxGridComponent;
  constructor(private accountService: AccountService,private masterService: MasterService,private fb: FormBuilder,private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.initilizeForm();  
    this.loadProcess();  
  }

  loadProcess(){
    // var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService.getProcess(this.user.locationId).subscribe(cardList => {
      this.sizeProcessList = cardList;
    })
    //console.log("sss",this.sizeProcessList);
  }

  SaveProcess() { 
    if(this.saveButton == true) {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    var obj = {
      createUserId: this.user.userId,
      Process: this.mstrProcess.get('Process').value.trim(),
      autoId: this.mstrProcess.get('AutoId').value,
      LocationId: this.user.locationId,
    };
   
    this.masterService.saveProcess(obj).subscribe((result) => {    
      if (result == 1) {
        this.toastr.success("Process save Successfully !!!");
        this.loadProcess();
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Process update Successfully !!!");
       this.loadProcess();
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Process already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }          
    }, error => {
      this.validationErrors = error;
    }) 
  } else {
    this.toastr.error('Save permission denied !!!');
  }
 }

 public singleSelection(event: IComboSelectionChangeEventArgs) {
   //console.log("ssa",event);
  if (event.added.length) {
    event.newSelection = event.added;
  }
 }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

      var authMenus = this.user.permitMenus;

      if (authMenus != null) {
        if (authMenus.filter((x) => x.autoIdx == 104).length > 0) {
          this.saveButton = true;
        }
      }
     
    this.mstrProcess = this.fb.group ({
      AutoId : [0],
      CreateUserId : this.user.userId,
      Process: ['', [Validators.required , Validators.maxLength(30)]],      
    })
  } 


  refreshPage() {
    this.mstrProcess.reset();
  }

  onEdit(event,cellId) {
    //console.log(cellId.rowID);    
    const ids = cellId.rowID;    
    const selectedRowData = this.sizeGrid.data.filter((record) => {
        return record.autoId == ids;
    });

    this.mstrProcess.get('Process').setValue(selectedRowData[0]["process"]);
    this.mstrProcess.get('AutoId').setValue(selectedRowData[0]["autoId"]); 
  }

  public AutoSelection(event: IComboSelectionChangeEventArgs) {
    //console.log("ssa",event);
   if (event.added.length) {
     event.newSelection = event.added;
   }
  }

  clearControls() {
    //this.masterColor.reset();
    this.mstrProcess.get('AutoId').setValue(0);
    this.mstrProcess.get('CreateUserId').setValue(this.user.userId);
    //this.mstrProcess.get('Code').setValue("");
    this.mstrProcess.get('Process').setValue("");
  }
  
  resetControls(){
    this.mstrProcess.reset();
    this.clearControls();
    //this.clearGridRows();
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
}
