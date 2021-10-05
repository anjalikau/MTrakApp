import { Component, OnInit, ViewChild } from '@angular/core';
import { DefaultSortingStrategy, IgxColumnComponent, IgxGridComponent, ISortingExpression, SortingDirection } from 'igniteui-angular';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-cost-list',
  templateUrl: './cost-list.component.html',
  styleUrls: ['./cost-list.component.css']
})
export class CostListComponent implements OnInit {
  costNumberList = []; 
  public expr: ISortingExpression[];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('costListGrid', { static: true })
  public costListGrid: IgxGridComponent;     
     

  constructor(private salesOrderServices: SalesorderService) { }

  ngOnInit(): void {
    // this.loadCostHeaderList();

    /// INITILIZE GRID GROUP EXPRESSION
    this.expr = [
      {
        dir: SortingDirection.Asc,
        fieldName: 'refNo',
        ignoreCase: false,
        strategy: DefaultSortingStrategy.instance(),
      },
      // { dir: SortingDirection.Asc, fieldName: 'ShipCity', ignoreCase: false,
      //   strategy: DefaultSortingStrategy.instance() }
    ];
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  // loadCostHeaderList() {
  //  this.salesOrderServices.getCostHeaderList().subscribe(result => {
  //    this.costNumberList = result; 
  //  })
  // }

  onViewCostingDetails(event, cellId) {
    // this.router.navigate(['/boldreport']);
    const ids = cellId.rowID;
    const selectedRowData = this.costListGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    var obj = {
      refNo: selectedRowData[0]["refNo"],
      versionNo: selectedRowData[0]["versionControl"],
      isActive: selectedRowData[0]["isActive"]
    }
    /// STORE OBJECT IN LOCAL STORAGE
    localStorage.setItem('cost', JSON.stringify(obj));
    window.open('/Costing', '_blank');

    // this.router.navigateByUrl('/boldreport', { state: obj });
  }

}



