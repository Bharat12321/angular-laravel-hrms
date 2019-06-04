import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Bank } from './bank-create-update/bank.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { BankCreateUpdateComponent } from './bank-create-update/bank-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class BankComponent implements List<Bank>, OnInit, OnDestroy {

  subject$: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
  data$: Observable<Bank[]>;
  banks: Bank[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Code', property: 'code', visible: true, isModelProperty: true },
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Bank> | null;
  database: ListDatabase<Bank>;

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
      this.service.getAll('/bank').subscribe(data => {
      this.banks = data;
      this.subject$.next(this.banks);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Bank>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((banks) => {
        this.banks = banks;
        this.database.dataChange.next(banks);
        this.resultsLength = banks.length;
      });
      this.dataSource = new ListDataSource<Bank>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createBank() {
    this.dialog.open(BankCreateUpdateComponent).afterClosed().subscribe((bank: Bank) => {
      if (bank) {
        this.service.create('/bank',bank).subscribe(
        newBank => {
          this.isLoadingResults = false;
          this.banks.unshift(new Bank(newBank));
          this.subject$.next(this.banks);
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

  updateBank(bank) {
    this.dialog.open(BankCreateUpdateComponent, {
      data: bank
    }).afterClosed().subscribe((bank) => {
      if (bank) {
      this.service.update('/bank/'+bank.id,bank)
      .subscribe(
        updatedBank => {
      this.isLoadingResults = false;
          const index = this.banks.findIndex((existingBank) => existingBank.id === updatedBank.id);
          this.banks[index] = new Bank(updatedBank);
          this.subject$.next(this.banks);
        });
      }
    });
  }

  deleteBank(bank) {
    this.banks.splice(this.banks.findIndex((existingBank) => existingBank.id === bank.id), 1);
    this.subject$.next(this.banks);
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
