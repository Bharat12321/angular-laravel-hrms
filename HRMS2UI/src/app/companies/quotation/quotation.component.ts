import { Component, Input, OnDestroy, OnInit,AfterViewInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Quotation } from './quotation.model';
import { QuotationViewComponent } from './quotation-view/quotation-view.component';
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
  selector: 'vr-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class QuotationComponent implements List<Quotation>, OnInit,AfterViewInit, OnDestroy {

  subject$: ReplaySubject<Quotation[]> = new ReplaySubject<Quotation[]>(1);
  data$: Observable<Quotation[]>;
  quotations: Quotation[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Number', property: 'id', visible: true, isModelProperty: true },
    { name: 'Date', property: 'date', visible: true, isModelProperty: true },
    { name: 'Amount', property: 'total', visible: true, isModelProperty: true },
    { name: 'Action', property: 'statusString', visible: true }
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Quotation> | null;
  database: ListDatabase<Quotation>;

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
  afterquotationGenerate()
  {
    
    this.getData();
  }
   public getData()
   {
     this.isLoadingResults = true;
      this.service.getAll('/invoice/company/1/'+localStorage.getItem('companyId')).subscribe(data => {
      this.quotations = data;
      this.subject$.next(this.quotations);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Quotation>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((quotations) => {
        this.quotations = quotations;
        this.database.dataChange.next(quotations);
        this.resultsLength = quotations.length;
      });
      this.dataSource = new ListDataSource<Quotation>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
   }
  viewQuotation(id) {

    this.dialog.open(QuotationViewComponent, {
      data: id
    });
  }
  markApprove(pay) {
      if (pay) {
      this.service.update('/quotation/approve/'+pay.id,pay)
      .subscribe(
        updatedMedical => {
          this.getData();
        });
      }
  }


  deleteQuotation(quotation) {
    if (quotation) {
      this.service.delete('/quotation/'+quotation.id)
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
