import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Payment } from './payment-create-update/payment.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { PaymentCreateUpdateComponent } from './payment-create-update/payment-create-update.component';
import { ReceiptViewComponent } from './receipt-view/receipt-view.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class PaymentComponent implements List<Payment>, OnInit, OnDestroy {

  subject$: ReplaySubject<Payment[]> = new ReplaySubject<Payment[]>(1);
  data$: Observable<Payment[]>;
  payments: Payment[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Category', property: 'categoryName', visible: true, isModelProperty: true },
    { name: 'Name', property: 'ledgerName', visible: true, isModelProperty: true },
    { name: 'Code', property: 'code', visible: true, isModelProperty: true },
    { name: 'Amount', property: 'amount_paid', visible: true, isModelProperty: true },
    { name: 'Reference', property: 'reference', visible: true, isModelProperty: true },
    { name: 'Date', property: 'paid_date_formatted', visible: true, isModelProperty: true },
    { name: 'Mode', property: 'modeName', visible: true, isModelProperty: true },
    { name: 'Remarks', property: 'remarks', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  type_id: number;
  add: boolean;
  pageHead: string;
  url: string;
  start_date : any;
  end_date : any;
  dataSource: ListDataSource<Payment> | null;
  database: ListDatabase<Payment>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  constructor(
    private service: DataService,
    private route:ActivatedRoute,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog) {
    
  }
  viewReceipt(id) {

    this.dialog.open(ReceiptViewComponent, {
      data: id
    });
  }

  ngOnInit() {
    this.start_date = new Date();
    this.end_date  = new Date();
    this.route.params.subscribe( params =>
      {
        var type = params['type'];
        switch (type) {
          case 'income':
            this.pageHead = 'Day Income';
            this.type_id = 1;
            this.add = true;
            this.url='/payment/filter/income';
            break;
          case 'expense':
            this.pageHead = 'Day Expense';
            this.type_id = 2;
            this.add = true;
            this.url='/payment/filter/expense';
            break;
          case 'income_month':
            this.pageHead = 'Month Income';
            this.type_id = 1;
            this.add = false;
            this.url='/payment/filter/income_month';
            break;
          case 'expense_month':
            this.pageHead = 'Month Expense';
            this.type_id = 2;
            this.add = false;
            this.url='/payment/filter/expense_month';
            break;
          default:
            this.pageHead = 'Payment';
            this.type_id = 1;
            this.add = false;
            this.url='/payment';
            break;
        }
        this.getData(this.url);
      }
    );
  }
  getData(url){
    this.isLoadingResults = true;
      this.service.getAll(url).subscribe(data => {
      this.payments = data;
      this.subject$.next(this.payments);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Payment>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((payments) => {
        this.payments = payments;
        this.database.dataChange.next(payments);
        this.resultsLength = payments.length;
      });
      this.dataSource = new ListDataSource<Payment>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createPayment() {
    this.dialog.open(PaymentCreateUpdateComponent).afterClosed().subscribe((payment: Payment) => {
      if (payment) {
        payment.type_id= this.type_id;
        this.service.create('/payment',payment).subscribe(
        newPayment => {
          this.getData(this.url);
          },
          (error: AppError) => {
            if (error instanceof BadInput) {
               //this.form.setErrors(error.originalError);
            }
            else throw error;
          });
      }
    });
  }

  updatePayment(payment) {
    if(payment.taggable_type ==='Ledger'){
      this.dialog.open(PaymentCreateUpdateComponent, {
        data: payment,
      }).afterClosed().subscribe((payment) => {
        if (payment) {
        payment.type_id= this.type_id;
        this.isLoadingResults = true;
        this.service.update('/payment/'+payment.id,payment)
        .subscribe(
          updatedPayment => {
            this.getData(this.url);
          });
        }
      });
    }
  }
  filterDate(type,event): void
  {
    if(type === 'start'){
      this.start_date = event.value;
    }else{
      this.end_date = event.value;
    }
    let detail = this.type_id + ','+ this.start_date + ','+this.end_date ;
    let url = '/payment/filter/'+ detail;
    this.getData(url);
  }
  deletePayment(payment) {
    this.payments.splice(this.payments.findIndex((existingPayment) => existingPayment.id === payment.id), 1);
    this.subject$.next(this.payments);
  }

  onFilterChange(value) {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = value;
  }

  exportData(){
    this.dataSource.exportData();
  }
  ngOnDestroy() {
  }
}
