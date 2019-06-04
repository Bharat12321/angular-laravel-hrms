import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../../core/list/list.interface';
import { Role } from './role-create-update/role.model';
import { ListColumn } from '../../../core/list/list-column.model';
import { ListDataSource } from '../../../core/list/list-datasource';
import { ListDatabase } from '../../../core/list/list-database';
import { componentDestroyed } from '../../../core/utils/component-destroyed';
import { RoleCreateUpdateComponent } from './role-create-update/role-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../../app.animation';

import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class RoleComponent implements List<Role>, OnInit, OnDestroy {

  subject$: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);
  data$: Observable<Role[]>;
  roles: Role[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;

  @Input()
  columns: ListColumn[] = [
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Role> | null;
  database: ListDatabase<Role>;

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
      this.isLoadingResults = true;
    this.service.getAll('/user/role').subscribe(data => {
      this.roles = data;
      this.subject$.next(this.roles);
      this.data$ = this.subject$.asObservable();

      this.database = new ListDatabase<Role>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((roles) => {
        this.roles = roles;
        this.database.dataChange.next(roles);
        this.resultsLength = roles.length;
        this.dataSource = new ListDataSource<Role>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
      });
    });

    
  }

  createRole() {
    this.dialog.open(RoleCreateUpdateComponent).afterClosed().subscribe((role: Role) => {
      if (role) {
        this.service.create('/user/role',role).subscribe(
        newRole => {
          this.roles.unshift(new Role(newRole));
          this.subject$.next(this.roles);
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

  updateRole(role) {
    this.dialog.open(RoleCreateUpdateComponent, {
      data: role
    }).afterClosed().subscribe((role) => {
      if (role) {
      this.service.update('/user/role/'+role.id,role)
      .subscribe(
        updatedRole => {
          const index = this.roles.findIndex((existingRole) => existingRole.id === updatedRole.id);
          this.roles[index] = new Role(updatedRole);
          this.subject$.next(this.roles);
        });
      }
    });
  }

  deleteRole(role) {
    this.roles.splice(this.roles.findIndex((existingRole) => existingRole.id === role.id), 1);
    this.subject$.next(this.roles);
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
