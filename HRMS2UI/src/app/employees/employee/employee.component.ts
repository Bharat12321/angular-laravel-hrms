import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Employee } from './employee-create-update/employee.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { EmployeeCreateUpdateComponent } from './employee-create-update/employee-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';
import { Router } from '@angular/router';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class EmployeeComponent implements List<Employee>, OnInit, OnDestroy {

  subject$: ReplaySubject<Employee[]> = new ReplaySubject<Employee[]>(1);
  data$: Observable<Employee[]>;
  employees: Employee[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Code', property: 'code', visible: true, isModelProperty: true },
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Designation', property: 'designationName', visible: true, isModelProperty: true },
    { name: 'Nationality', property: 'countryName', visible: true, isModelProperty: true },
    { name: 'Sponsor', property: 'sponsorName', visible: false, isModelProperty: true },
    //{ name: 'Bank', property: 'bankName', visible: false, isModelProperty: true },
    //{ name: 'Account Number', property: 'account_number', visible: false, isModelProperty: true },
    //{ name: 'IBAN', property: 'iban', visible: false, isModelProperty: true },
    //{ name: 'Salary', property: 'salary', visible: true, isModelProperty: true },
    { name: 'Gender', property: 'gender', visible: true, isModelProperty: true },
    { name: 'Date of Birth', property: 'date_of_birth_formated', visible: true, isModelProperty: true },
    { name: 'Email', property: 'email', visible: true, isModelProperty: true },
    { name: 'Mobile Number', property: 'contact_number', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true }
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Employee> | null;
  database: ListDatabase<Employee>;

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
    this.route.params.subscribe( params =>
      {
        var type = params['type'];
        var url = '';
        switch (type) {
          case 'all':
            url='/employee/filter/all';
            break;
          case 'active':
            url='/employee/filter/active';
            break;
          default:
            url='/employee';
            break;
        }
        this.getData(url);
      }
    );  
  }
  getData(url){
    this.isLoadingResults = true;
      this.service.getAll(url).subscribe(data => {
      this.employees = data;
      this.subject$.next(this.employees);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Employee>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((employees) => {
        this.employees = employees;
        this.database.dataChange.next(employees);
        this.resultsLength = employees.length;
      });
      this.dataSource = new ListDataSource<Employee>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createEmployee() {
    this.dialog.open(EmployeeCreateUpdateComponent).afterClosed().subscribe((employee: Employee) => {
      if (employee) {
        this.service.create('/employee',employee).subscribe(
        newEmployee => {
          this.getData('/employee');
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

  updateEmployee(employee) {
    this.dialog.open(EmployeeCreateUpdateComponent, {
      data: employee
    }).afterClosed().subscribe((employee) => {
      if (employee) {
      this.service.update('/employee/'+employee.id,employee)
      .subscribe(
        updatedEmployee => {
          this.getData('/employee');
        });
      }
    });
  }
  
  viewEmployee(id) {
    this.router.navigate(['/employee/profile/'+id]);
  }

  deleteEmployee(employee) {
    this.employees.splice(this.employees.findIndex((existingEmployee) => existingEmployee.id === employee.id), 1);
    this.subject$.next(this.employees);
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
