import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Contact } from './contact-create-update/contact.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { ContactCreateUpdateComponent } from './contact-create-update/contact-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute,Router} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class ContactComponent implements List<Contact>, OnInit, OnDestroy {

  subject$: ReplaySubject<Contact[]> = new ReplaySubject<Contact[]>(1);
  data$: Observable<Contact[]>;
  contacts: Contact[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  url : string;
  type : string;
  name : string;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Email', property: 'email', visible: true, isModelProperty: true },
    { name: 'Phone', property: 'phone', visible: true, isModelProperty: true },
    { name: 'Remarks', property: 'remarks', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Contact> | null;
  database: ListDatabase<Contact>;

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
    this.url = '/contact/company/'+localStorage.getItem('companyId');
    this.getData(this.url);
  }
  getData(url){
      this.isLoadingResults = true;
      this.service.getAll(this.url).subscribe(data => {
      this.contacts = data;
      this.subject$.next(this.contacts);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Contact>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((contacts) => {
        this.contacts = contacts;
        this.database.dataChange.next(contacts);
        this.resultsLength = contacts.length;
      });
      this.dataSource = new ListDataSource<Contact>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }

  createContact() {
    this.dialog.open(ContactCreateUpdateComponent).afterClosed().subscribe((contact: Contact) => {
      if (contact) {
        this.service.create('/contact',contact).subscribe(
        newContact => {
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

  updateContact(contact) {
    this.dialog.open(ContactCreateUpdateComponent, {
      data: contact
    }).afterClosed().subscribe((contact) => {
      if (contact) {
      this.service.update('/contact/'+contact.id,contact)
      .subscribe(
        updatedContact => {
          this.getData(this.url);

        });
      }
    });
  }


  deleteContact(contact) {
    this.contacts.splice(this.contacts.findIndex((existingContact) => existingContact.id === contact.id), 1);
    this.subject$.next(this.contacts);
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
