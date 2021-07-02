import { Component, OnInit } from '@angular/core';
import { IgxGridTransaction, IgxTransactionService } from 'igniteui-angular';

@Component({
  providers: [{ provide: IgxGridTransaction, useClass: IgxTransactionService }],
  selector: 'app-grid-with-transactions',
  //templateUrl: './grid-with-transactions.component.html',
  //styleUrls: ['./grid-with-transactions.component.css']
  //selector: "app-grid-with-transactions",
  template: "<ng-content></ng-content>"
})
export class GridWithTransactionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
