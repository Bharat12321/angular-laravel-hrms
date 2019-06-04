import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Attachment } from './attachment-create-update/attachment.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { AttachmentCreateUpdateComponent } from './attachment-create-update/attachment-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

import { environment } from '../../../environments/environment';
@Component({
  selector: 'vr-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class AttachmentComponent implements List<Attachment>, OnInit, OnDestroy {

  subject$: ReplaySubject<Attachment[]> = new ReplaySubject<Attachment[]>(1);
  data$: Observable<Attachment[]>;
  attachments: Attachment[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Type', property: 'typeName', visible: true, isModelProperty: true },
    { name: 'Number', property: 'number', visible: true, isModelProperty: true },
    { name: 'Expiry Date', property: 'expiry_date_formatted', visible: true, isModelProperty: true },
    { name: 'Remarks', property: 'remarks', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Attachment> | null;
  database: ListDatabase<Attachment>;

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
    this.service.getAll('/company/attachment/'+localStorage.getItem('companyId')).subscribe(data => {
      this.attachments = data;
      this.subject$.next(this.attachments);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Attachment>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((attachments) => {
        this.attachments = attachments;
        this.database.dataChange.next(attachments);
        this.resultsLength = attachments.length;
      });
      this.dataSource = new ListDataSource<Attachment>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createAttachment() {
    this.dialog.open(AttachmentCreateUpdateComponent).afterClosed().subscribe((attachment: Attachment) => {
      if (attachment) {
        this.service.create('/attachment',attachment).subscribe(
        newAttachment => {
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

  updateAttachment(attachment) {
    this.dialog.open(AttachmentCreateUpdateComponent, {
      data: attachment
    }).afterClosed().subscribe((attachment) => {
      if (attachment) {
      this.service.update('/attachment/'+attachment.id,attachment)
      .subscribe(
        updatedAttachment => {
          this.getData();
        });
      }
    });
  }
  downloadAttachment(attachment)
  {
    window.open(environment.imageEndPoint + attachment.location, '_blank');
  }
  deleteAttachment(attachment) {
    this.attachments.splice(this.attachments.findIndex((existingAttachment) => existingAttachment.id === attachment.id), 1);
    this.subject$.next(this.attachments);
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
