import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Sale } from 'app/sales/sale/sale-create-update/sale.model';

@Injectable()
export class SaleService {

  constructor() {

  }

  private saleDataSubject = new Subject<any>();
  private cancelRequestSubject = new Subject<any>();

  sendUpdatedData(saleData: Sale) {
    this.saleDataSubject.next(saleData);
  }

  getUpdatedData(): Observable<any> {
    return this.saleDataSubject.asObservable();
  }

  notifyCancelRequest() {
    this.cancelRequestSubject.next();
  }

  cancelRequestListener(): Observable<any> {
    return this.cancelRequestSubject.asObservable();
  }

}
