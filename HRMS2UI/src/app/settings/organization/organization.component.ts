import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Organization } from './organization-create-update/organization.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { OrganizationCreateUpdateComponent } from './organization-create-update/organization-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class OrganizationComponent implements List<Organization>, OnInit, OnDestroy {

  subject$: ReplaySubject<Organization[]> = new ReplaySubject<Organization[]>(1);
  data$: Observable<Organization[]>;
  organizations: Organization[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Code', property: 'code', visible: true, isModelProperty: true },
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Company Name', property: 'company_name', visible: true, isModelProperty: true },
    { name: 'Country', property: 'countryName', visible: true, isModelProperty: true },
    { name: 'City', property: 'city', visible: true, isModelProperty: true },
    { name: 'Address', property: 'address', visible: false, isModelProperty: true },
    { name: 'Pin Code', property: 'pin_code', visible: false, isModelProperty: true },
    //{ name: 'Device', property: 'deviceName', visible: true, isModelProperty: true },
    { name: 'Remarks', property: 'remarks', visible: false, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Organization> | null;
  database: ListDatabase<Organization>;

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
      this.service.getAll('/organization_unit').subscribe(data => {
      this.organizations = data;
      this.subject$.next(this.organizations);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Organization>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((organizations) => {
        this.organizations = organizations;
        this.database.dataChange.next(organizations);
        this.resultsLength = organizations.length;
      });
      this.dataSource = new ListDataSource<Organization>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createOrganization() {
    this.dialog.open(OrganizationCreateUpdateComponent).afterClosed().subscribe((organization: Organization) => {
      if (organization) {
        this.service.create('/organization_unit',organization).subscribe(
        newOrganization => {
          this.isLoadingResults = false;
          this.organizations.unshift(new Organization(newOrganization));
          this.subject$.next(this.organizations);
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

  updateOrganization(organization) {
    this.dialog.open(OrganizationCreateUpdateComponent, {
      data: organization
    }).afterClosed().subscribe((organization) => {
      if (organization) {
      this.service.update('/organization_unit/'+organization.id,organization)
      .subscribe(
        updatedOrganization => {
      this.isLoadingResults = false;
          const index = this.organizations.findIndex((existingOrganization) => existingOrganization.id === updatedOrganization.id);
          this.organizations[index] = new Organization(updatedOrganization);
          this.subject$.next(this.organizations);
        });
      }
    });
  }

  deleteOrganization(organization) {
    this.organizations.splice(this.organizations.findIndex((existingOrganization) => existingOrganization.id === organization.id), 1);
    this.subject$.next(this.organizations);
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
