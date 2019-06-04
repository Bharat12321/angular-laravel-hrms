import { Component, Inject, OnInit ,ComponentRef, ComponentFactoryResolver, ViewContainerRef, ViewChild, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Sale } from '../sale-create-update/sale.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';

import { ChildComponent } from '../child/child.component'
import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

export class InvoiceItem {
  item_id = null;
  qty = 0;
  cost = 0;
  total = 0;
}

@Component({
  selector: 'vr-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {

  @ViewChild('viewContainerRef', { read: ViewContainerRef }) VCR: ViewContainerRef;

  index: number = 0;

  componentsReferences = [];

  static id = 100;
  statusData : Object[];

  items : Object[];
  companies : Object[];
  modes : Object[];
  payment :boolean;
  item_display :boolean;
  vat : number;

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<PayComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private CFR: ComponentFactoryResolver,
              private store: Store<fromRoot.State>) {

    
  }


  ngOnInit() {

      this.service.getAll('/sale/createupdate').subscribe(data => {
      this.modes = data.modes;
    });
    if (this.defaults) {
      this.mode = 'update';
      this.payment = false;
      this.item_display = false;
    } else {
      this.defaults = {} as Sale; 
      this.payment = true;
      this.item_display = true;
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [PayComponent.id++],
      mode_id: [this.defaults.mode_id || null,],
      reference: [this.defaults.reference || null,],
      paid_amount: [this.defaults.due_amount || 0,],
      remarks: [this.defaults.remarks || '',],
      status: [this.defaults.status || '1'],
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createSale();
    } else if (this.mode === 'update') {
      this.updateSale();
    }
  }
  changePayment(event)
  {
    if(event.value === 'Pay Now'){
      this.payment = true;
    }else{
      this.payment = false;
    }
  }
  createSale() {
    const sale = this.form.value;
    this.dialogRef.close(sale);
  }

  updateSale() {
    const sale = this.form.value;
    sale.id = this.defaults.id;

    this.dialogRef.close(sale);
  }

  get invoiceItems(): FormArray {
    return this.form.get('invoiceItems') as FormArray;
  };

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }


}
