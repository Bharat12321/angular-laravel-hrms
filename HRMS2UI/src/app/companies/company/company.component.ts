import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Company } from './company-create-update/company.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { CompanyCreateUpdateComponent } from './company-create-update/company-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute,Router} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class CompanyComponent implements List<Company>, OnInit, OnDestroy {

  subject$: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);
  data$: Observable<Company[]>;
  companys: Company[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  url : string;
  type : string;
  name : string;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Address', property: 'address', visible: true, isModelProperty: true },
    { name: 'City', property: 'city', visible: true, isModelProperty: true },
    { name: 'Po Code', property: 'pin_code', visible: true, isModelProperty: true },
    { name: 'Reference', property: 'reference', visible: true, isModelProperty: true },
    { name: 'Contact Person', property: 'person', visible: true, isModelProperty: true },
    { name: 'Email', property: 'email', visible: true, isModelProperty: true },
    { name: 'Phone', property: 'phone', visible: true, isModelProperty: true },
    { name: 'Website', property: 'website', visible: true, isModelProperty: true },
    { name: 'Remarks', property: 'remarks', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Company> | null;
  database: ListDatabase<Company>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  constructor(
    private service: DataService,
    private route:ActivatedRoute,
    private router: Router, 
    private ref: ChangeDetectorRef,
    private dialog: MatDialog) {
    
  }

  ngOnInit() {

    this.route.params.subscribe( params =>
      {
        this.type = params['type'];
        switch (this.type) {
          case '1':
            this.name = 'Lead';
            break;
          case '2':
            this.name = 'Client';
            break;
          case '3':
            this.name = 'Supplier';
            break;
          default:
            this.name = 'Client';
            break;
        }
        this.url = '/company/type/'+this.type;
        this.getData(this.url);
      }
    ); 
  }
  getData(url){
      this.isLoadingResults = true;
      this.service.getAll(this.url).subscribe(data => {
      this.companys = data;
      this.subject$.next(this.companys);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Company>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((companys) => {
        this.companys = companys;
        this.database.dataChange.next(companys);
        this.resultsLength = companys.length;
      });
      this.dataSource = new ListDataSource<Company>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createCompany() {
    this.dialog.open(CompanyCreateUpdateComponent).afterClosed().subscribe((company: Company) => {
      if (company) {
        company.type = this.type;
        this.service.create('/company',company).subscribe(
        newCompany => {
          this.getData(this.url);
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

  updateCompany(company) {
    this.dialog.open(CompanyCreateUpdateComponent, {
      data: company
    }).afterClosed().subscribe((company) => {
      if (company) {
      this.service.update('/company/'+company.id,company)
      .subscribe(
        updatedCompany => {
          this.getData(this.url);
        });
      }
    });
  }

  viewCompany(id) {
    this.router.navigate(['/company/profile/'+id]);
  }

  deleteCompany(company) {
    this.companys.splice(this.companys.findIndex((existingCompany) => existingCompany.id === company.id), 1);
    this.subject$.next(this.companys);
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
