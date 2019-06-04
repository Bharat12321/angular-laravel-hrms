import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../../core/list/list.interface';
import { ConfigItem } from './config-item.model';
import { ListColumn } from '../../../core/list/list-column.model';
import { ListDataSource } from '../../../core/list/list-datasource';
import { ListDatabase } from '../../../core/list/list-database';
import { componentDestroyed } from '../../../core/utils/component-destroyed';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../../app.animation';

import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';
import {ActivatedRoute,Router} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-config-item',
  templateUrl: './config-item.component.html',
  styleUrls: ['./config-item.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class ConfigItemComponent implements List<ConfigItem>, OnInit, OnDestroy {

  subject$: ReplaySubject<ConfigItem[]> = new ReplaySubject<ConfigItem[]>(1);
  data$: Observable<ConfigItem[]>;
  configItem: ConfigItem[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  configItemId:number;
  
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Description', property: 'description', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<ConfigItem> | null;
  database: ListDatabase<ConfigItem>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  constructor(
    private service: DataService,
    private route:ActivatedRoute,
    private ref: ChangeDetectorRef,
    private router: Router, 
    private dialog: MatDialog) {
    
  }

  ngOnInit() {
      this.isLoadingResults = true;
      this.service.getAll('/config_item').subscribe(data => {
      this.configItem = data;
      this.subject$.next(this.configItem);
      this.data$ = this.subject$.asObservable();

      this.database = new ListDatabase<ConfigItem>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((configItem) => {
        this.configItem = configItem;
        this.database.dataChange.next(configItem);
        this.resultsLength = configItem.length;
      });
      this.dataSource = new ListDataSource<ConfigItem>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createConfigItem() {
    
  }

  updateConfigItem(configItem) {
    
    this.router.navigate(['/setting/config/'+configItem.id+'/'+configItem.name]);
  }

  deleteConfigItem(configItem) {
    
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
