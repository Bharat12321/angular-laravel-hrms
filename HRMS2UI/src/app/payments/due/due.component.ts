import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Due } from './due-create-update/due.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { DueCreateUpdateComponent } from './due-create-update/due-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-due',
  templateUrl: './due.component.html',
  styleUrls: ['./due.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class DueComponent implements List<Due>, OnInit, OnDestroy {

  subject$: ReplaySubject<Due[]> = new ReplaySubject<Due[]>(1);
  data$: Observable<Due[]>;
  dues: Due[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Code', property: 'code', visible: true, isModelProperty: true },
    { name: 'First Name', property: 'first_name', visible: true, isModelProperty: true },
    { name: 'Middle Name', property: 'middle_name', visible: true, isModelProperty: true },
    { name: 'Last Name', property: 'last_name', visible: true, isModelProperty: true },
    //{ name: 'First Name', property: 'gender', visible: true, isModelProperty: true },
    //{ name: 'Middle Name', property: 'dob', visible: true, isModelProperty: true },
    { name: 'Email', property: 'email_id', visible: true, isModelProperty: true },
    { name: 'Blood Group', property: 'blood_group', visible: true, isModelProperty: true },
    { name: 'Birth Place', property: 'birth_place', visible: true, isModelProperty: true },
    { name: 'Religion', property: 'religion', visible: true, isModelProperty: true },
    //{ name: 'First Name', property: 'admission_date', visible: true, isModelProperty: true },
    { name: 'languages', property: 'languages', visible: true, isModelProperty: true },
    { name: 'Mobile Number', property: 'mobile_no', visible: true, isModelProperty: true },
    { name: 'Passport Number', property: 'passport_no', visible: true, isModelProperty: true },
    { name: 'Height', property: 'height', visible: true, isModelProperty: true },
    { name: 'Weight', property: 'weight', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Due> | null;
  database: ListDatabase<Due>;

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
      this.service.getAll('/due').subscribe(data => {
      this.dues = data;
      this.subject$.next(this.dues);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Due>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((dues) => {
        this.dues = dues;
        this.database.dataChange.next(dues);
        this.resultsLength = dues.length;
      });
      this.dataSource = new ListDataSource<Due>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createDue() {
    this.dialog.open(DueCreateUpdateComponent).afterClosed().subscribe((due: Due) => {
      if (due) {
        this.service.create('/due',due).subscribe(
        newDue => {
          this.isLoadingResults = false;
          this.dues.unshift(new Due(newDue));
          this.subject$.next(this.dues);
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

  updateDue(due) {
    this.dialog.open(DueCreateUpdateComponent, {
      data: due
    }).afterClosed().subscribe((due) => {
      if (due) {
      this.service.update('/due/'+due.id,due)
      .subscribe(
        updatedDue => {
      this.isLoadingResults = false;
          const index = this.dues.findIndex((existingDue) => existingDue.id === updatedDue.id);
          this.dues[index] = new Due(updatedDue);
          this.subject$.next(this.dues);
        });
      }
    });
  }

  deleteDue(due) {
    this.dues.splice(this.dues.findIndex((existingDue) => existingDue.id === due.id), 1);
    this.subject$.next(this.dues);
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
