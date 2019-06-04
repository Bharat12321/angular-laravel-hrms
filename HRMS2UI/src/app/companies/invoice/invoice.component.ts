import { Component, Input, OnDestroy, OnInit,AfterViewInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Invoice } from './invoice.model';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { PayComponent } from './pay/pay.component';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';
import { Router } from '@angular/router';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class InvoiceComponent implements List<Invoice>, OnInit,AfterViewInit, OnDestroy {

  subject$: ReplaySubject<Invoice[]> = new ReplaySubject<Invoice[]>(1);
  data$: Observable<Invoice[]>;
  invoices: Invoice[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Number', property: 'id', visible: true, isModelProperty: true },
    { name: 'Date', property: 'date', visible: true, isModelProperty: true },
    { name: 'Amount', property: 'total', visible: true, isModelProperty: true },
    { name: 'Paid', property: 'paid', visible: true, isModelProperty: true },
    { name: 'Balance', property: 'amount', visible: true, isModelProperty: true },
    { name: 'Action', property: 'statusString', visible: true }
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Invoice> | null;
  database: ListDatabase<Invoice>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  constructor(
    private service: DataService,
    private route:ActivatedRoute,
    private router: Router, 
    private ref: ChangeDetectorRef,
    private dialog: MatDialog) {
    
  }

  ngOnInit() {
    this.getData();
  }
  ngAfterViewInit()
  {
    this.getData();
  }
  afterinvoiceGenerate()
  {
    
    this.getData();
  }
   public getData()
   {
     this.isLoadingResults = true;
      this.service.getAll('/invoice/company/2/'+localStorage.getItem('companyId')).subscribe(data => {
      this.invoices = data;
      this.subject$.next(this.invoices);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Invoice>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((invoices) => {
        this.invoices = invoices;
        this.database.dataChange.next(invoices);
        this.resultsLength = invoices.length;
      });
      this.dataSource = new ListDataSource<Invoice>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
   }
  viewInvoice(id) {

    this.dialog.open(InvoiceViewComponent, {
      data: id
    });
  }
  payAmount(pay) {
    this.dialog.open(PayComponent, {
      data: pay
    }).afterClosed().subscribe((pay) => {
      if (pay) {
      this.service.update('/invoice/payment/'+pay.id,pay)
      .subscribe(
        updatedMedical => {
          this.getData();
        });
      }
    });
  }


  deleteInvoice(invoice) {
    if (invoice) {
      this.service.delete('/invoice/'+invoice.id)
      .subscribe(
        deleteFee => {
          this.getData();
        });
    }
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
