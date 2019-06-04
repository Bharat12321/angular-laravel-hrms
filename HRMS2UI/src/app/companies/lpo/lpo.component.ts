import { Component, Input, OnDestroy, OnInit,AfterViewInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { LPO } from './lpo.model';
import { LPOViewComponent } from './lpo-view/lpo-view.component';
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
  selector: 'vr-lpo',
  templateUrl: './lpo.component.html',
  styleUrls: ['./lpo.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class LPOComponent implements List<LPO>, OnInit,AfterViewInit, OnDestroy {

  subject$: ReplaySubject<LPO[]> = new ReplaySubject<LPO[]>(1);
  data$: Observable<LPO[]>;
  lpos: LPO[];
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
  dataSource: ListDataSource<LPO> | null;
  database: ListDatabase<LPO>;

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
  afterlpoGenerate()
  {
    
    this.getData();
  }
   public getData()
   {
     this.isLoadingResults = true;
      this.service.getAll('/invoice/company/3/'+localStorage.getItem('companyId')).subscribe(data => {
      this.lpos = data;
      this.subject$.next(this.lpos);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<LPO>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((lpos) => {
        this.lpos = lpos;
        this.database.dataChange.next(lpos);
        this.resultsLength = lpos.length;
      });
      this.dataSource = new ListDataSource<LPO>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
   }
  viewLPO(id) {

    this.dialog.open(LPOViewComponent, {
      data: id
    });
  }
  payAmount(pay) {
    this.dialog.open(PayComponent, {
      data: pay
    }).afterClosed().subscribe((pay) => {
      if (pay) {
      this.service.update('/lpo/payment/'+pay.id,pay)
      .subscribe(
        updatedMedical => {
          this.getData();
        });
      }
    });
  }


  deleteLPO(lpo) {
    if (lpo) {
      this.service.delete('/lpo/'+lpo.id)
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
