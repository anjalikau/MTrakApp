import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxCheckboxComponent, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CostingGroup } from 'src/app/_models/costingGroup';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-costing-group',
  templateUrl: './master-costing-group.component.html',
  styleUrls: ['./master-costing-group.component.css']
})
export class MasterCostingGroupComponent implements OnInit {
  costGroupForm: FormGroup;
  costGroupList: CostingGroup[];
  user: User;
  validationErrors: string[] = [];
  
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  
  @ViewChild("CostGroupGrid", { static: true }) 
  public CostGroupGrid: IgxGridComponent;

  @ViewChild('chkIsMatAllocated', { read: IgxCheckboxComponent })
  public chkIsMatAllocated: IgxCheckboxComponent;

  constructor(private accountService: AccountService, private fb: FormBuilder
    ,private masterService: MasterService ,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCostingGroup();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

    this.costGroupForm = this.fb.group ({
      autoId : [0],
      createUserId : this.user.userId,
      name: ['', [Validators.required , Validators.maxLength(50)]],
      isMaterialAllocated: [false],
    })
  } 

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadCostingGroup(){
    var user: User = JSON.parse(localStorage.getItem('user'));

    this.masterService.getCostingGroup(user.locationId).subscribe(cardList => {
      this.costGroupList = cardList;
    })
  }

  saveCostingGroup() { 
    var user: User = JSON.parse(localStorage.getItem('user'));

    var obj = {
      createUserId: this.user.userId,
      name: this.costGroupForm.get('name').value.trim(),
      autoId: this.costGroupForm.get('autoId').value,
      isMaterialAllocated: this.chkIsMatAllocated.checked,
      locationId: user.locationId,
    };

    this.masterService.saveCostingGroup(obj).subscribe((result) => {    
      if (result == 1) {
        this.toastr.success("Costing Group save Successfully !!!");
        this.loadCostingGroup();
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Costing Group update Successfully !!!");
        this.loadCostingGroup();
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Costing Group already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }    
       
    }, error => {
      this.validationErrors = error;
    }) 
  }

  clearControls() {
    this.costGroupForm.get('autoId').setValue(0);
    this.costGroupForm.get('createUserId').setValue(this.user.userId);
    this.costGroupForm.get('name').reset();
    this.costGroupForm.get('isMaterialAllocated').reset();

    this.costGroupForm.get('name').enable();
  }

    //// EDIT ROW LOADS DETAILS TO CONTROL 
   onEdit(event,cellId) {
    const ids = cellId.rowID;    
    const selectedRowData = this.CostGroupGrid.data.filter((record) => {
        return record.autoId == ids;
    });

    this.costGroupForm.get('name').setValue(selectedRowData[0]["name"]);
    this.costGroupForm.get('autoId').setValue(selectedRowData[0]["autoId"]); 
    this.costGroupForm.get('isMaterialAllocated').setValue(selectedRowData[0]["isMaterialAllocated"]); 

    this.costGroupForm.get('name').disable();
  }

}
