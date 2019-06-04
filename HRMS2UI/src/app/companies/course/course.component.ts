import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Course } from './course-create-update/course.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { CourseCreateUpdateComponent } from './course-create-update/course-create-update.component';
import { InvoiceComponent } from '../invoice/invoice.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class CourseComponent implements List<Course>, OnInit, OnDestroy {

  @Output() invoiceGenerate: EventEmitter<boolean> = new EventEmitter(); // for load the content change

  subject$: ReplaySubject<Course[]> = new ReplaySubject<Course[]>(1);
  data$: Observable<Course[]>;
  courses: Course[];
  roles: Object[];
  invoiceCourse: any;
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Checkbox', property: 'checkbox', visible: true },
    { name: 'Course Name', property: 'courseName', visible: true, isModelProperty: true },
    { name: 'Date', property: 'date_formatted', visible: true, isModelProperty: true },
    { name: 'Quantity', property: 'quantity', visible: true, isModelProperty: true },
    { name: 'Unit Price', property: 'unit_price', visible: true, isModelProperty: true },
    { name: 'Discount', property: 'discount', visible: true, isModelProperty: true },
    { name: 'Total Price', property: 'total_price', visible: true, isModelProperty: true },
    /*{ name: 'Used', property: 'used', visible: true, isModelProperty: true },
    { name: 'Balance', property: 'balance', visible: true, isModelProperty: true },*/
    { name: 'Remarks', property: 'remarks', visible: false, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Course> | null;
  database: ListDatabase<Course>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(InvoiceComponent)  private invoice: InvoiceComponent;

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
    this.invoiceCourse = [];
  }
  getData()
  {
      this.isLoadingResults = true;
      this.service.getAll('/company_course/company/'+localStorage.getItem('companyId')).subscribe(data => {
      this.courses = data;
      this.subject$.next(this.courses);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Course>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((courses) => {
        this.courses = courses;
        this.database.dataChange.next(courses);
        this.resultsLength = courses.length;
      });
      this.dataSource = new ListDataSource<Course>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createCourse() {
    this.dialog.open(CourseCreateUpdateComponent).afterClosed().subscribe((course: Course) => {
      if (course) {
        this.service.create('/company_course',course).subscribe(
        newCourse => {
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

  updateCourse(course) {
    this.dialog.open(CourseCreateUpdateComponent, {
      data: course
    }).afterClosed().subscribe((course) => {
      if (course) {
      this.service.update('/company_course/'+course.id,course)
      .subscribe(
        updatedCourse => {
          this.getData();
        });
      }
    });
  }

  deleteCourse(course) {
    if (course) {
      this.service.delete('/company_course/'+course.id)
      .subscribe(
        deleteCourse => {
          this.courses.splice(this.courses.findIndex((existingCourse) => existingCourse.id === course.id), 1);
          this.subject$.next(this.courses);
        });
    }
  }
  generateInvoice() {
    if (this.invoiceCourse.length) {
      let courses = {courses:this.invoiceCourse};
        this.service.create('/company_course/invoice/'+localStorage.getItem('companyId'),courses)
      .subscribe(
        invoice => {
          window.location.reload();
        },
        (error: AppError) => {
          if (error instanceof BadInput) {
             //this.form.setErrors(error.originalError);
          }
          else throw error;
        });
    }
  }
  onChange(event) {
    if(event.checked) {
      this.invoiceCourse.push((event.source.value));
    } else {
      const i = this.invoiceCourse.indexOf(event.source.value);
      this.invoiceCourse.splice(i,1);
    }
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
