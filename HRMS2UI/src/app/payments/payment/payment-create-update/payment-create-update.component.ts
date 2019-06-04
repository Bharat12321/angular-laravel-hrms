import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Payment } from './payment.model';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';


import { BadInput } from '../../../common/bad-input';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';


import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-payment-create-update',
  templateUrl: './payment-create-update.component.html',
  styleUrls: ['./payment-create-update.component.scss']
})
export class PaymentCreateUpdateComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  ledgers : Object[];
  categories : Object[];
  modes : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<PaymentCreateUpdateComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
      this.service.getAll('/payment/createupdate').subscribe(data => {
      this.ledgers = data.ledgers;
      this.categories = data.categories;
      this.modes = data.mode;
    });

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Payment; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [PaymentCreateUpdateComponent.id++],
      taggable_id: [this.defaults.taggable_id || null,],
      category_id: [this.defaults.category_id || null,],
      mode_id: [this.defaults.mode_id || null,],
      taggable_type: ['Ledger'],
      amount_paid: [this.defaults.amount_paid || '',],
      reference: [this.defaults.reference || '',],
      paid_date: [this.defaults.paid_date || '',],
      remarks: [this.defaults.remarks || '',],
      status: [this.defaults.status || '1']
    });
  }

  save() {
    if (this.mode === 'create') {
      this.createPayment();
    } else if (this.mode === 'update') {
      this.updatePayment();
    }
  }

  createPayment() {
    const payment = this.form.value;
    this.dialogRef.close(payment);
  }

  updatePayment() {
    const payment = this.form.value;
    payment.id = this.defaults.id;

    this.dialogRef.close(payment);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
