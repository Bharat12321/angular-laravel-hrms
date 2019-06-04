import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Category } from './category-create-update/category.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { CategoryCreateUpdateComponent } from './category-create-update/category-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class CategoryComponent implements List<Category>, OnInit, OnDestroy {

  subject$: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);
  data$: Observable<Category[]>;
  categorys: Category[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Category> | null;
  database: ListDatabase<Category>;

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
      this.service.getAll('/payment_category').subscribe(data => {
      this.categorys = data;
      this.subject$.next(this.categorys);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Category>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((categorys) => {
        this.categorys = categorys;
        this.database.dataChange.next(categorys);
        this.resultsLength = categorys.length;
      });
      this.dataSource = new ListDataSource<Category>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createCategory() {
    this.dialog.open(CategoryCreateUpdateComponent).afterClosed().subscribe((category: Category) => {
      if (category) {
        this.service.create('/payment_category',category).subscribe(
        newCategory => {
          this.isLoadingResults = false;
          this.categorys.unshift(new Category(newCategory));
          this.subject$.next(this.categorys);
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

  updateCategory(category) {
    this.dialog.open(CategoryCreateUpdateComponent, {
      data: category
    }).afterClosed().subscribe((category) => {
      if (category) {
      this.service.update('/payment_category/'+category.id,category)
      .subscribe(
        updatedCategory => {
      this.isLoadingResults = false;
          const index = this.categorys.findIndex((existingCategory) => existingCategory.id === updatedCategory.id);
          this.categorys[index] = new Category(updatedCategory);
          this.subject$.next(this.categorys);
        });
      }
    });
  }

  deleteCategory(category) {
    this.categorys.splice(this.categorys.findIndex((existingCategory) => existingCategory.id === category.id), 1);
    this.subject$.next(this.categorys);
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
