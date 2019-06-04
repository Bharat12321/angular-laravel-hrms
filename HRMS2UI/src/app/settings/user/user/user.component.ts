import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../../core/list/list.interface';
import { User } from './user-create-update/user.model';
import { ListColumn } from '../../../core/list/list-column.model';
import { ListDataSource } from '../../../core/list/list-datasource';
import { ListDatabase } from '../../../core/list/list-database';
import { componentDestroyed } from '../../../core/utils/component-destroyed';
import { UserCreateUpdateComponent } from './user-create-update/user-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../../app.animation';

import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class UserComponent implements List<User>, OnInit, OnDestroy {

  subject$: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  data$: Observable<User[]>;
  users: User[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;

  @Input()
  columns: ListColumn[] = [
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'User Name', property: 'username', visible: true, isModelProperty: true },
    { name: 'Role', property: 'roleName', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true }
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<User> | null;
  database: ListDatabase<User>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  constructor(
    private service: DataService,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getData();
  }
  getData()
  {

    this.isLoadingResults = true;
    this.service.getAll('/user').subscribe(data => {
      this.users = data;
      this.subject$.next(this.users);
      this.data$ = this.subject$.asObservable();

      this.database = new ListDatabase<User>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((users) => {
        this.users = users;
        this.database.dataChange.next(users);
        this.resultsLength = users.length;
      });
      this.dataSource = new ListDataSource<User>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createUser() {
    this.dialog.open(UserCreateUpdateComponent).afterClosed().subscribe((user: User) => {
      if (user) {
        this.service.create('/user',user).subscribe(
        newUser => {
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

  updateUser(user) {
    this.dialog.open(UserCreateUpdateComponent, {
      data: user
    }).afterClosed().subscribe((user) => {
      if (user) {
      this.service.update('/user/'+user.id,user)
      .subscribe(
        updatedUser => {
            this.getData();
        });
      }
    });
  }

  deleteUser(user) {
    this.users.splice(this.users.findIndex((existingUser) => existingUser.id === user.id), 1);
    this.subject$.next(this.users);
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
