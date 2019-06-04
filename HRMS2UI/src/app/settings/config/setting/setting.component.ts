import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../../core/list/list.interface';
import { Setting } from './setting-create-update/setting.model';
import { ListColumn } from '../../../core/list/list-column.model';
import { ListDataSource } from '../../../core/list/list-datasource';
import { ListDatabase } from '../../../core/list/list-database';
import { componentDestroyed } from '../../../core/utils/component-destroyed';
import { SettingCreateUpdateComponent } from './setting-create-update/setting-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../../app.animation';

import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class SettingComponent implements List<Setting>, OnInit, OnDestroy {

  subject$: ReplaySubject<Setting[]> = new ReplaySubject<Setting[]>(1);
  data$: Observable<Setting[]>;
  settings: Setting[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  configItemId:number;
  configItemName:string;
  
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Description', property: 'description', visible: true, isModelProperty: true },
    { name: 'Sort', property: 'sort', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Setting> | null;
  database: ListDatabase<Setting>;

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
      this.route.params.subscribe( params =>
          {
            this.configItemId = params['id'];
            this.configItemName = params['name'];
            localStorage.setItem('configItemId', this.configItemId.toString());
          }
      );
      this.isLoadingResults = true;
      this.service.getAll('/config_item/config/'+this.configItemId).subscribe(data => {
      this.settings = data;
      this.subject$.next(this.settings);
      this.data$ = this.subject$.asObservable();

      this.database = new ListDatabase<Setting>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((settings) => {
        this.settings = settings;
        this.database.dataChange.next(settings);
        this.resultsLength = settings.length;
      });
      this.dataSource = new ListDataSource<Setting>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createSetting() {
    this.dialog.open(SettingCreateUpdateComponent).afterClosed().subscribe((setting: Setting) => {
      if (setting) {
      this.isLoadingResults = true;
        //setting['config_item_id'] = 1;
        this.service.create('/config',setting).subscribe(
        newSetting => {
          this.isLoadingResults = false;
          this.settings.unshift(new Setting(newSetting));
          this.subject$.next(this.settings);
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

  updateSetting(setting) {
    this.dialog.open(SettingCreateUpdateComponent, {
      data: setting
    }).afterClosed().subscribe((setting) => {
      if (setting) {
      this.service.update('/config/'+setting.id,setting)
      .subscribe(
        updatedSetting => {
      this.isLoadingResults = false;
          const index = this.settings.findIndex((existingSetting) => existingSetting.id === updatedSetting.id);
          this.settings[index] = new Setting(updatedSetting);
          this.subject$.next(this.settings);
        });
      }
    });
  }

  deleteSetting(setting) {
    this.settings.splice(this.settings.findIndex((existingSetting) => existingSetting.id === setting.id), 1);
    this.subject$.next(this.settings);
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
