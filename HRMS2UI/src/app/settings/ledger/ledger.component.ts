import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Ledger } from './ledger-create-update/ledger.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { LedgerCreateUpdateComponent } from './ledger-create-update/ledger-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class LedgerComponent implements List<Ledger>, OnInit, OnDestroy {

  subject$: ReplaySubject<Ledger[]> = new ReplaySubject<Ledger[]>(1);
  data$: Observable<Ledger[]>;
  ledgers: Ledger[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Address', property: 'address', visible: true, isModelProperty: true },
    { name: 'Remarks', property: 'remarks', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true }
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Ledger> | null;
  database: ListDatabase<Ledger>;

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

  ngOnInit() {
      this.isLoadingResults = true;
      this.service.getAll('/ledger').subscribe(data => {
      this.ledgers = data;
      this.subject$.next(this.ledgers);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Ledger>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((ledgers) => {
        this.ledgers = ledgers;
        this.database.dataChange.next(ledgers);
        this.resultsLength = ledgers.length;
      });
      this.dataSource = new ListDataSource<Ledger>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createLedger() {
    this.dialog.open(LedgerCreateUpdateComponent).afterClosed().subscribe((ledger: Ledger) => {
      if (ledger) {
        this.service.create('/ledger',ledger).subscribe(
        newLedger => {
          this.isLoadingResults = false;
          this.ledgers.unshift(new Ledger(newLedger));
          this.subject$.next(this.ledgers);
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

  updateLedger(ledger) {
    this.dialog.open(LedgerCreateUpdateComponent, {
      data: ledger
    }).afterClosed().subscribe((ledger) => {
      if (ledger) {
      this.service.update('/ledger/'+ledger.id,ledger)
      .subscribe(
        updatedLedger => {
      this.isLoadingResults = false;
          const index = this.ledgers.findIndex((existingLedger) => existingLedger.id === updatedLedger.id);
          this.ledgers[index] = new Ledger(updatedLedger);
          this.subject$.next(this.ledgers);
        });
      }
    });
  }

  deleteLedger(ledger) {
    this.ledgers.splice(this.ledgers.findIndex((existingLedger) => existingLedger.id === ledger.id), 1);
    this.subject$.next(this.ledgers);
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
