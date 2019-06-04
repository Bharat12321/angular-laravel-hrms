import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Item } from './item-create-update/item.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { ItemCreateUpdateComponent } from './item-create-update/item-create-update.component';
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
  selector: 'vr-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class ItemComponent implements List<Item>, OnInit, OnDestroy {

  subject$: ReplaySubject<Item[]> = new ReplaySubject<Item[]>(1);
  data$: Observable<Item[]>;
  items: Item[];
  roles: Object[];
  invoiceItem: any;
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
   
    { name: 'Item Name', property: 'itemname', visible: true, isModelProperty: true },
    { name: 'itemcode', property: 'itemcode', visible: true, isModelProperty: true },
    { name: 'barcode', property: 'barcode', visible: true, isModelProperty: true },
    { name: 'Category', property: 'item_category_id', visible: true, isModelProperty: true },
    { name: 'Manufacturar', property: 'item_manufacturar_id', visible: true, isModelProperty: true },
    { name: 'Shelf', property: 'item_shelf_id', visible: true, isModelProperty: true },
    { name: 'Row', property: 'item_row_id', visible: true, isModelProperty: true },
    { name: 'Coloumn', property: 'item_col_id', visible: true, isModelProperty: true },
    { name: 'Unit', property: 'uom_id', visible: true, isModelProperty: true },
    { name: 'Rol', property: 'rol', visible: false, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Item> | null;
  database: ListDatabase<Item>;

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
      this.items = data;
      this.subject$.next(this.items);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Item>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((items) => {
        this.items = items;
        this.database.dataChange.next(items);
        this.resultsLength = items.length;
      });
      this.dataSource = new ListDataSource<Item>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createItem() {
    this.dialog.open(ItemCreateUpdateComponent).afterClosed().subscribe((item: Item) => {
      if (item) {
        this.service.create('/item',item).subscribe(
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

  updateItem(item) {
    this.dialog.open(ItemCreateUpdateComponent, {
      data: item
    }).afterClosed().subscribe((item) => {
      if (item) {
      this.service.update('/item/'+item.id,item)
      .subscribe(
        updatedItem => {
          this.getData();
        });
      }
    });
  }

  deleteItem(item) {
    if (item) {
      this.service.delete('/item/'+item.id)
      .subscribe(
        deleteItem => {
          this.items.splice(this.items.findIndex((existingItem) => existingItem.id === item.id), 1);
          this.subject$.next(this.items);
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
