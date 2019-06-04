import { Component, Input, OnDestroy, OnInit, ViewChild ,ChangeDetectorRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Line } from './line-create-update/line.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { LineCreateUpdateComponent } from './line-create-update/line-create-update.component';
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
  selector: 'vr-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class LineComponent implements List<Line>, OnInit, OnDestroy {

  @Output() invoiceGenerate: EventEmitter<boolean> = new EventEmitter(); // for load the content change

  subject$: ReplaySubject<Line[]> = new ReplaySubject<Line[]>(1);
  data$: Observable<Line[]>;
  lines: Line[];
  roles: Object[];
  invoiceLine: any;
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Checkbox', property: 'checkbox', visible: true },
    { name: 'Item Name', property: 'name', visible: true, isModelProperty: true },
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
  dataSource: ListDataSource<Line> | null;
  database: ListDatabase<Line>;

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
    this.invoiceLine = [];
  }
  getData()
  {
      this.isLoadingResults = true;
      this.service.getAll('/company_course/lead/'+localStorage.getItem('companyId')).subscribe(data => {
      this.lines = data;
      this.subject$.next(this.lines);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Line>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((lines) => {
        this.lines = lines;
        this.database.dataChange.next(lines);
        this.resultsLength = lines.length;
      });
      this.dataSource = new ListDataSource<Line>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createLine() {
    this.dialog.open(LineCreateUpdateComponent).afterClosed().subscribe((line: Line) => {
      if (line) {
        this.service.create('/company_course',line).subscribe(
        newLine => {
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

  updateLine(line) {
    this.dialog.open(LineCreateUpdateComponent, {
      data: line
    }).afterClosed().subscribe((line) => {
      if (line) {
      this.service.update('/company_course/'+line.id,line)
      .subscribe(
        updatedLine => {
          this.getData();
        });
      }
    });
  }

  deleteLine(line) {
    if (line) {
      this.service.delete('/company_course/'+line.id)
      .subscribe(
        deleteLine => {
          this.lines.splice(this.lines.findIndex((existingLine) => existingLine.id === line.id), 1);
          this.subject$.next(this.lines);
        });
    }
  }
  generateInvoice() {
    if (this.invoiceLine.length) {
      let lines = {lines:this.invoiceLine};
        this.service.create('/company_course/quotation/'+localStorage.getItem('companyId'),lines)
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
      this.invoiceLine.push((event.source.value));
    } else {
      const i = this.invoiceLine.indexOf(event.source.value);
      this.invoiceLine.splice(i,1);
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
