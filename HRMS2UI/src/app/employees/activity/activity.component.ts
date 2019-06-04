import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Activity } from './activity-create-update/activity.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { ActivityCreateUpdateComponent } from './activity-create-update/activity-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class ActivityComponent implements List<Activity>, OnInit, OnDestroy {

  subject$: ReplaySubject<Activity[]> = new ReplaySubject<Activity[]>(1);
  data$: Observable<Activity[]>;
  activitys: Activity[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Type', property: 'typeName', visible: true, isModelProperty: true },
    { name: 'Date', property: 'date_formatted', visible: true, isModelProperty: true },
    { name: 'Notification Date', property: 'notification_date_formatted', visible: true, isModelProperty: true },
    { name: 'Remarks', property: 'remarks', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Activity> | null;
  database: ListDatabase<Activity>;

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
      this.service.getAll('/employee/activity/'+localStorage.getItem('employeeId')).subscribe(data => {
      this.activitys = data;
      this.subject$.next(this.activitys);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Activity>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((activitys) => {
        this.activitys = activitys;
        this.database.dataChange.next(activitys);
        this.resultsLength = activitys.length;
      });
      this.dataSource = new ListDataSource<Activity>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createActivity() {
    this.dialog.open(ActivityCreateUpdateComponent).afterClosed().subscribe((activity: Activity) => {
      if (activity) {
        this.service.create('/activity',activity).subscribe(
        newActivity => {
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

  updateActivity(activity) {
    this.dialog.open(ActivityCreateUpdateComponent, {
      data: activity
    }).afterClosed().subscribe((activity) => {
      if (activity) {
      this.service.update('/activity/'+activity.id,activity)
      .subscribe(
        updatedActivity => {
          this.getData();
        });
      }
    });
  }

  deleteActivity(activity) {
    this.activitys.splice(this.activitys.findIndex((existingActivity) => existingActivity.id === activity.id), 1);
    this.subject$.next(this.activitys);
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
