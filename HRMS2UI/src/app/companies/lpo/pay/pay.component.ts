import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import { Router,NavigationStart,NavigationEnd,ActivatedRoute } from '@angular/router';
import { STATUS_DATA } from '../../../core/data/status';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'vr-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {

  static id = 100;
  statusData : Object[];

  data : any;
  types : Object[];
  modes : Object[];

  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
              private dialogRef: MatDialogRef<PayComponent>,
              private fb: FormBuilder,
              private router: Router, 
              private route:ActivatedRoute,
              private service: DataService,
              private store: Store<fromRoot.State>) {
  }

  ngOnInit() {

    this.service.getAll('/payment/createupdate').subscribe(data => {
      this.modes = data.mode;
    });
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {}; 
    }
    this.statusData = STATUS_DATA;
    this.form = this.fb.group({
      id: [PayComponent.id++],
      mode_id: [this.defaults.mode_id || null],
      amount: [this.defaults.amount || ''],
      date: [this.defaults.date || ''],
      remarks: [this.defaults.remarks || ''],
      company_id: [localStorage.getItem('companyId')],
      status: [this.defaults.status || '1']
    });
  }
  
  save() {
    if (this.mode === 'create') {
      this.createPay();
    } else if (this.mode === 'update') {
      this.updatePay();
    }
  }
  createPay() {
    const pay = this.form.value;
    this.dialogRef.close(pay);
  }

  updatePay() {
    const pay = this.form.value;
    pay.id = this.defaults.id;

    this.dialogRef.close(pay);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
