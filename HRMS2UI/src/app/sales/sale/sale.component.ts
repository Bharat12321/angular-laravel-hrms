import { Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';
import { List } from '../../core/list/list.interface';
import { Sale } from './sale-create-update/sale.model';
import { ListColumn } from '../../core/list/list-column.model';
import { ListDataSource } from '../../core/list/list-datasource';
import { ListDatabase } from '../../core/list/list-database';
import { componentDestroyed } from '../../core/utils/component-destroyed';
import { SaleCreateUpdateComponent } from './sale-create-update/sale-create-update.component';
import { PayComponent } from './pay/pay.component';
import { ReceiptViewComponent } from './receipt-view/receipt-view.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ROUTE_TRANSITION } from '../../app.animation';

import { BadInput } from '../../common/bad-input';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';


import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { SaleService } from 'app/services/sale.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'vr-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: { '[@routeTransition]': '' }
})
export class SaleComponent implements List<Sale>, OnInit, OnDestroy {

  subject$: ReplaySubject<Sale[]> = new ReplaySubject<Sale[]>(1);
  data$: Observable<Sale[]>;
  sales: Sale[];
  roles: Object[];
  isLoadingResults: boolean;
  isRateLimitReached: boolean;

  @Input()
  columns: ListColumn[] = [
    { name: 'Name', property: 'name', visible: true, isModelProperty: true },
    { name: 'Company', property: 'companyName', visible: true, isModelProperty: true },
    { name: 'Employee', property: 'employeeName', visible: true, isModelProperty: true },
    { name: 'Date', property: 'date_formatted', visible: true, isModelProperty: true },
    { name: 'Type', property: 'payment_type', visible: true, isModelProperty: true },
    { name: 'Price', property: 'sub_total', visible: true, isModelProperty: true },
    { name: 'Discount', property: 'discount', visible: true, isModelProperty: true },
    { name: 'Total', property: 'total', visible: true, isModelProperty: true },
    { name: 'Paid', property: 'paid_amount', visible: true, isModelProperty: true },
    { name: 'Due', property: 'due_amount', visible: true, isModelProperty: true },
    { name: 'Remarks', property: 'remarks', visible: true, isModelProperty: true },
    { name: 'Status', property: 'statusString', visible: true },
  ] as ListColumn[];

  pageSize = 10;
  resultsLength: number;
  type_id: number;
  add: boolean;
  pageHead: string;
  url: string;
  start_date: any;
  end_date: any;
  dataSource: ListDataSource<Sale> | null;
  database: ListDatabase<Sale>;
  viewState: "LIST" | "ADD" | "UPDATE" = "LIST";
  addUpdateSaleDataSubscription: Subscription;
  updateSaleDataSubscription: Subscription;
  cancelRequestSubscription: Subscription;
  selectedSale: Sale

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  constructor(
    private service: DataService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private saleService: SaleService
  ) {

  }
  viewReceipt(id) {

    this.dialog.open(ReceiptViewComponent, {
      data: id
    });
  }

  ngOnInit() {
    this.start_date = new Date();
    this.end_date = new Date();
    this.route.params.subscribe(params => {
      this.viewState = "LIST";
      var type = params['type'];
      switch (type) {
        case 'today':
          this.pageHead = 'Sale';
          this.type_id = 1;
          this.add = true;
          this.url = '/sale/filter/today';
          break;
        case 'month':
          this.pageHead = 'Month Sale';
          this.type_id = 1;
          this.add = false;
          this.url = '/sale/filter/month';
          break;
        case 'due':
          this.pageHead = 'Due';
          this.type_id = 1;
          this.add = false;
          this.url = '/sale/filter/due';
          break;
        default:
          this.pageHead = 'Sale';
          this.type_id = 1;
          this.add = true;
          this.url = '/sale';
          break;
      }
      this.getData(this.url);
    }
    );

    this.cancelRequestSubscription = this.saleService.cancelRequestListener().subscribe(() => {
      this.viewState = "LIST";
    })
  }
  getData(url) {
    this.isLoadingResults = true;
    this.service.getAll(url).subscribe(data => {
      this.sales = data;
      this.subject$.next(this.sales);
      this.data$ = this.subject$.asObservable();
      this.database = new ListDatabase<Sale>();
      this.data$
        .takeUntil(componentDestroyed(this))
        .filter(Boolean)
        .subscribe((sales) => {
          this.sales = sales;
          this.database.dataChange.next(sales);
          this.resultsLength = sales.length;
        });
      this.dataSource = new ListDataSource<Sale>(this.database, this.sort, this.paginator, this.columns);
      this.isLoadingResults = false;
      this.ref.detectChanges();
    });
  }
  createSale() {
    // this.dialog.open(SaleCreateUpdateComponent).afterClosed().subscribe((sale: Sale) => {
    //   if (sale) {
    //     sale.type_id= this.type_id;
    //     this.service.create('/sale',sale).subscribe(
    //     newSale => {
    //       this.getData(this.url);
    //       },
    //       (error: AppError) => {
    //         if (error instanceof BadInput) {
    //            //this.form.setErrors(error.originalError);
    //         }
    //         else throw error;
    //       });
    //   }
    // });
    this.viewState = "ADD";
    this.addUpdateSaleDataSubscription = this.saleService.getUpdatedData().subscribe((sale: Sale) => {
      this.viewState = "LIST";
      if (sale) {
        sale.type_id = this.type_id;
        this.service.create('/sale', sale).subscribe(
          newSale => {
            this.getData(this.url);
            this.addUpdateSaleDataSubscription.unsubscribe();
          },
          (error: AppError) => {
            if (error instanceof BadInput) {
              //this.form.setErrors(error.originalError);
            }
            else throw error;
          });
      }

    })
  }

  updateSale(sale) {

    // this.dialog.open(SaleCreateUpdateComponent, {
    //   data: sale,
    // }).afterClosed().subscribe((sale) => {
    //   if (sale) {
    //     this.isLoadingResults = true;
    //     this.service.update('/sale/' + sale.id, sale)
    //       .subscribe(
    //         updatedSale => {
    //           this.getData(this.url);
    //         });
    //   }
    // });
    this.selectedSale = sale;
    this.viewState = "UPDATE";
    this.addUpdateSaleDataSubscription = this.saleService.getUpdatedData().subscribe((sale: Sale) => {
      this.viewState = "LIST";
      if (sale) {
        this.isLoadingResults = true;
        this.service.update('/sale/' + sale.id, sale)
          .subscribe(
            updatedSale => {
              this.getData(this.url);
              this.addUpdateSaleDataSubscription.unsubscribe();
            });
      }
    })

  }

  pay(sale) {
    this.dialog.open(PayComponent, {
      data: sale,
    }).afterClosed().subscribe((sale) => {
      if (sale) {
        this.isLoadingResults = true;
        this.service.update('/sale/pay/' + sale.id, sale)
          .subscribe(
            updatedSale => {
              this.getData(this.url);
            });
      }
    });
  }
  filterDate(type, event): void {
    if (type === 'start') {
      this.start_date = event.value;
    } else {
      this.end_date = event.value;
    }
    let detail = this.type_id + ',' + this.start_date + ',' + this.end_date;
    let url = '/sale/filter/' + detail;
    this.getData(url);
  }
  deleteSale(sale) {
    if (confirm("Are you sure to delete?")) {
      if (sale) {
        this.service.delete('/sale/' + sale.id)
          .subscribe(
            deleteFee => {
              this.sales.splice(this.sales.findIndex((existingFee) => existingFee.id === sale.id), 1);
              this.subject$.next(this.sales);
            });
      }
    }
  }

  onFilterChange(value) {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = value;
  }

  exportData() {
    this.dataSource.exportData();
  }
  ngOnDestroy() {
    this.cancelRequestSubscription.unsubscribe();
  }
}
