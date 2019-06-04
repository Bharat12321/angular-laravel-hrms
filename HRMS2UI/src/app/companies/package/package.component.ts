import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Packages } from './package-create-update/package.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { PackageCreateUpdateComponent } from './package-create-update/package-create-update.component';
import { InvoiceComponent } from '../invoice/invoice.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class PackageComponent implements List<Packages>, OnInit, OnDestroy {

  subject$: ReplaySubject<Packages[]> = new ReplaySubject<Packages[]>(1);
  data$: Observable<Packages[]>;
  packages: Packages[];
  roles: Object[];
  invoiceItem: any;
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
   
    { name: 'Package Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Description', property: 'description', visible: true, isModelProperty: true },
    { name: 'Category', property: 'package_category', visible: true, isModelProperty: true },
    { name: 'price', property: 'price', visible: true, isModelProperty: true },
    { name: 'sessions', property: 'sessions', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Packages> | null;
  database: ListDatabase<Packages>;

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
    this.getData();
   
  }
  getData()
  {
      this.isLoadingResults = true;
      this.service.getAll('/item').subscribe(data => {
      this.packages = data;
      this.subject$.next(this.packages);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Packages>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((packages) => {
        this.packages = packages;
        this.database.dataChange.next(packages);
        this.resultsLength = packages.length;
      });
      this.dataSource = new ListDataSource<Packages>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createItem() {
    this.dialog.open(PackageCreateUpdateComponent).afterClosed().subscribe((packages: Packages) => {
      if (packages) {
        this.service.create('/item',packages).subscribe(
        newItem => {
            this.getData();
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

  updateItem(packages) {
    this.dialog.open(PackageCreateUpdateComponent, {
      data: packages
    }).afterClosed().subscribe((packages) => {
      if (packages) {
      this.service.update('/item/'+packages.id,packages)
      .subscribe(
        updatedItem => {
          this.getData();
        });
      }
    });
  }

  deleteItem(packages) {
    if (packages) {
      this.service.delete('/item/'+packages.id)
      .subscribe(
        deleteItem => {
          this.packages.splice(this.packages.findIndex((existingpackages) => existingpackages.id === packages.id), 1);
          this.subject$.next(this.packages);
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
