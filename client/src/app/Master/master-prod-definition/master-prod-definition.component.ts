import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Process } from 'src/app/_models/process';
import { ProdDefinition } from 'src/app/_models/prodDefinition';
import { StoreSite } from 'src/app/_models/storeSite';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-prod-definition',
  templateUrl: './master-prod-definition.component.html',
  styleUrls: ['./master-prod-definition.component.css'],
})
export class MasterProdDefinitionComponent implements OnInit {
  prodDefiForm: FormGroup;
  user: User;
  prodDefiList: any[];
  prodDefiDetails: ProdDefinition[];
  processList: Process[];
  validationErrors: string[] = [];
  storeSiteList: StoreSite[];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  isEditMode: boolean = false;
  saveButton: boolean = false;
  removeButton: boolean = false;
  formTitle: string = 'New Production Definition';
  isProdDefSel: boolean = false;

  @ViewChild('ProdDefiGrid', { static: true })
  public ProdDefiGrid: IgxGridComponent;

  @ViewChild('ProdDefName', { read: IgxComboComponent })
  public ProdDefName: IgxComboComponent;

  constructor(
    private fb: FormBuilder,
    public adminService: AdminService,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadProdDefinitionList();
    this.loadProcess();
    this.loadStoreSite();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 105).length > 0) {
        this.saveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 141).length > 0) {
        this.removeButton = true;
      }
    }

    this.prodDefiForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      pdHeaderId: [''],
      pdName: ['', [Validators.required, Validators.maxLength(50)]],
      processId: ['', Validators.required],
      receiveSiteId: ['', Validators.required],
      dispatchSiteId: ['', Validators.required],
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  //// LODS PRDUCTION DEFINITION NAME LIST
  loadProdDefinitionList() {
    this.masterService.getProductDefinitionList().subscribe((cardList) => {
      this.prodDefiList = cardList;
      // console.log(this.prodDefiList);
    });
  }

  onSelectProdDefiChange(event) {
    this.prodDefiDetails = [];
    this.isProdDefSel = false;
    for (const item of event.added) {
      this.loadProductDefinitionDt(item);
    }
  }

  /// LOADS PRODUCTION DEFINITION DETAILS
  loadProductDefinitionDt(prodHeaderId) {
    this.isProdDefSel = true;
    this.masterService
      .getProductDefinitionDt(prodHeaderId)
      .subscribe((result) => {
        this.prodDefiDetails = result;
      });
  }

  //// LOADS STORE SITE
  loadStoreSite() {
    this.masterService.getStoreSite().subscribe((cardList) => {
      this.storeSiteList = cardList;
    });
  }

  //// LOADS PROCESS BASED ON LOCATION
  loadProcess() {
    // var user: User = JSON.parse(localStorage.getItem('user'));

    this.masterService.getProcess(this.user.locationId).subscribe((cardList) => {
      this.processList = cardList;
    });
  }

  saveProdDefinition() {
    if (this.saveButton == true) {
    if (this.validateControls()) {
      var pdHeaderId =
        this.prodDefiForm.get('pdHeaderId').value == null
          ? 0
          : this.prodDefiForm.get('pdHeaderId').value[0];

      var obj = {
        autoId: 0,
        createUserId: this.user.userId,
        pDName: this.prodDefiForm.get('pdName').value.trim(),
        processId: this.prodDefiForm.get('processId').value[0],
        receiveSiteId: this.prodDefiForm.get('receiveSiteId').value[0],
        dispatchSiteId: this.prodDefiForm.get('dispatchSiteId').value[0],
        pDHeaderId: pdHeaderId,
      };

      console.log(obj);
      this.masterService.saveProductDefinition(obj).subscribe(
        (result) => {
          if (result['result'] == 1) {
            this.toastr.success('Production Definition save Successfully !!!');
            this.clearFormControls();
            this.prodDefiForm.get('pdName').reset();
            this.loadProdDefinitionList();
            this.loadProductDefinitionDt(pdHeaderId);
          } else if (result['result'] == 2) {
            this.toastr.success(
              'Production Definition update Successfully !!!'
            );
            this.loadProductDefinitionDt(pdHeaderId);
            this.clearFormControls();
          } else if (result['result'] == -1 || result['result'] == -2) {
            this.toastr.warning('Production Definition already exists !!!');
          } else if (result['result'] == -4) {
            this.toastr.warning('Process can not be same!!!');
          } else if (result['result'] == -3) {
            this.toastr.warning('Update fail, already assigned to Cost sheet!!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result['result'].toString()
            );
          }
        },
        (error) => {
          this.validationErrors = error;
        }
      );
    }
  } else {
    this.toastr.error('Save Permission denied !!!');
  }
  }

  onDelete(event, cellId) {  
    if(this.removeButton == true) {  
    const ids = cellId.rowID;
    const selectedRowData = this.ProdDefiGrid.data.filter((record) => {
      return record.autoId == ids;
    });
    //console.log(selectedRowData);
    var obj = {
      autoId: ids,
      createUserId: this.user.userId,
      pDHeaderId: selectedRowData[0]['pdHeaderId'],
    };
    
    this.masterService.deleteProductDefinition(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Production Definition delete Successfully !!!');
          // this.loadProductDefinitionDt(selectedRowData[0]['pdHeaderId']);
          this.loadProdDefinitionList();
          this.ProdDefName.setSelectedItem(selectedRowData[0]['pdHeaderId'],true);
          this.loadProductDefinitionDt(selectedRowData[0]['pdHeaderId']);
        } else if (result == -1) {
          this.toastr.warning('Delete fail, already assigned to Cost sheet!!!');
        } else {
          this.toastr.warning(
            'Contact Admin. Error No:- ' + result['result'].toString()
          );
        }
      });  
    } else {
      this.toastr.error('Delete permission denied !!!');
    }  
  }

  validateControls() {
    /// CHECK STORE SITE IS SAME OR NOT 
    if (
      this.prodDefiForm.get('receiveSiteId').value[0] ==
      this.prodDefiForm.get('dispatchSiteId').value[0]
    ) {
      this.toastr.warning('Sotre Site can not be same !!!');
      return false;
    } else {
      return true;
    }
  }

  clearFormControls() {
    this.prodDefiForm.get('autoId').setValue(0);
    this.prodDefiForm.get('createUserId').setValue(this.user.userId);

    this.prodDefiForm.get('processId').reset();
    this.prodDefiForm.get('receiveSiteId').reset();
    this.prodDefiForm.get('dispatchSiteId').reset();
    this.prodDefiForm.get('pdName').disable();
  }

  resetFormControls() {
    this.prodDefiDetails = [];
    this.isProdDefSel = false;
    this.formTitle = 'New Production Definition';
    this.prodDefiForm.get('autoId').setValue(0);
    this.prodDefiForm.get('createUserId').setValue(this.user.userId);
    this.prodDefiForm.get('pdHeaderId').reset();
    this.prodDefiForm.get('pdName').reset();
    this.prodDefiForm.get('processId').reset();
    this.prodDefiForm.get('receiveSiteId').reset();
    this.prodDefiForm.get('dispatchSiteId').reset();

    this.prodDefiForm.get('pdName').enable();
  }

  /// ADD PRODUCT DEFINITION DETAILS
  onAddProdDefinitionDt() {
    this.formTitle = 'Update Production Definition';
    this.prodDefiForm.get('pdName').setValue(this.ProdDefName.value);
    this.prodDefiForm.get('pdName').disable();
  }
}
