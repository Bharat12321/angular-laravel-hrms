import { Component, Input, OnDestroy, OnInit, ViewChild,ChangeDetectorRef  } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Sponsor } from './sponsor-create-update/sponsor.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { SponsorCreateUpdateComponent } from './sponsor-create-update/sponsor-create-update.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'vr-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class SponsorComponent implements List<Sponsor>, OnInit, OnDestroy {

  subject$: ReplaySubject<Sponsor[]> = new ReplaySubject<Sponsor[]>(1);
  data$: Observable<Sponsor[]>;
  sponsors: Sponsor[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;
  
  @Input()
  columns: ListColumn[] = [
    { name: 'Code', property: 'code', visible: true, isModelProperty: true },
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Company Name', property: 'company_name', visible: true, isModelProperty: true },
    { name: 'Employer Eid', property: 'employer_eid', visible: true, isModelProperty: true },
    { name: 'Payer Eid', property: 'payer_eid', visible: true, isModelProperty: true },
    { name: 'Expiry Date', property: 'id_expiry_date', visible: true, isModelProperty: true },
    { name: 'Remarks', property: 'remarks', visible: false, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  dataSource: ListDataSource<Sponsor> | null;
  database: ListDatabase<Sponsor>;

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
      this.service.getAll('/sponsor').subscribe(data => {
      this.sponsors = data;
      this.subject$.next(this.sponsors);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Sponsor>();
      this.data$
      .takeUntil(componentDestroyed(this))
      .filter(Boolean)
      .subscribe((sponsors) => {
        this.sponsors = sponsors;
        this.database.dataChange.next(sponsors);
        this.resultsLength = sponsors.length;
      });
      this.dataSource = new ListDataSource<Sponsor>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createSponsor() {
    this.dialog.open(SponsorCreateUpdateComponent).afterClosed().subscribe((sponsor: Sponsor) => {
      if (sponsor) {
        this.service.create('/sponsor',sponsor).subscribe(
        newSponsor => {
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

  updateSponsor(sponsor) {
    this.dialog.open(SponsorCreateUpdateComponent, {
      data: sponsor
    }).afterClosed().subscribe((sponsor) => {
      if (sponsor) {
      this.service.update('/sponsor/'+sponsor.id,sponsor)
      .subscribe(
        updatedSponsor => {
          this.getData();
        });
      }
    });
  }

  deleteSponsor(sponsor) {
    this.sponsors.splice(this.sponsors.findIndex((existingSponsor) => existingSponsor.id === sponsor.id), 1);
    this.subject$.next(this.sponsors);
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
